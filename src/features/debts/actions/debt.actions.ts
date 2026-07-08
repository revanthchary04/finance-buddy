"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getDebts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("debts")
    .select("*, debt_payments(*), loan_payments(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching debts:", error);
    return [];
  }

  return data;
}

export async function getLoanPayments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("loan_payments")
    .select("*")
    .eq("user_id", user.id)
    .order("payment_date", { ascending: false });

  if (error) {
    console.error("Error fetching loan payments:", error);
    return [];
  }

  return data;
}

export async function createDebt(formData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { type, name, principal_amount, interest_rate, start_date, tenure_months, min_due } = formData;

  const current_balance = Number(principal_amount);

  const { data: debt, error: debtError } = await supabase
    .from("debts")
    .insert({
      user_id: user.id,
      type,
      name,
      principal_amount: current_balance,
      current_balance: current_balance,
      interest_rate: interest_rate || 0,
      start_date,
      status: "active"
    })
    .select()
    .single();

  if (debtError) {
    console.error("Error creating debt:", debtError);
    return { error: debtError.message };
  }

  // Generate Payment Schedule for Loans
  if (type === "loan" && tenure_months) {
    const P = current_balance;
    const R = (interest_rate || 0) / 12 / 100;
    const N = Number(tenure_months);
    
    let EMI = P;
    if (R > 0) {
      EMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    } else {
      EMI = P / N;
    }

    const payments = [];
    const startDate = new Date(start_date);

    for (let i = 1; i <= N; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i);

      payments.push({
        debt_id: debt.id,
        user_id: user.id,
        amount: EMI,
        due_date: dueDate.toISOString().split("T")[0],
        status: "pending"
      });
    }

    const { error: paymentsError } = await supabase.from("debt_payments").insert(payments);
    if (paymentsError) {
      console.error("Error generating payments:", paymentsError);
    }
  } else if (type === "credit_card") {
    // Just a placeholder payment or no auto-schedule
    // Usually for credit cards, user adds payments manually each month, but we can seed one.
    const dueDate = new Date(start_date);
    dueDate.setMonth(dueDate.getMonth() + 1);
    await supabase.from("debt_payments").insert({
        debt_id: debt.id,
        user_id: user.id,
        amount: min_due ? (current_balance * (Number(min_due)/100)) : 0,
        due_date: dueDate.toISOString().split("T")[0],
        status: "pending"
    });
  }

  revalidatePath("/debts");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markPaymentPaid(paymentId: string, debtId: string, amount: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Mark payment as paid
  const { error: updateError } = await supabase
    .from("debt_payments")
    .update({ status: "paid", paid_date: new Date().toISOString().split("T")[0] })
    .eq("id", paymentId)
    .eq("user_id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  // Deduct from current balance
  const { data: debt } = await supabase.from("debts").select("current_balance").eq("id", debtId).single();
  if (debt) {
    const newBalance = Math.max(0, Number(debt.current_balance) - amount);
    await supabase.from("debts").update({ current_balance: newBalance }).eq("id", debtId);
  }

  // Find Loan Repayment Category
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("name", "Loan Repayment")
    .eq("is_global", true)
    .single();

  if (category) {
    await supabase.from("transactions").insert({
      user_id: user.id,
      amount: amount,
      type: "expense",
      category_id: category.id,
      date: new Date().toISOString(),
      description: "Auto-logged Debt Payment"
    });
  }

  revalidatePath("/debts");
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return { success: true };
}

export async function updateDebt(id: string, formData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { type, name, principal_amount, interest_rate, start_date, tenure_months, min_due } = formData;

  const { error } = await supabase
    .from("debts")
    .update({
      type,
      name,
      principal_amount: Number(principal_amount),
      interest_rate: interest_rate ? Number(interest_rate) : 0,
      start_date,
      tenure_months: tenure_months ? Number(tenure_months) : null,
      min_due: min_due ? Number(min_due) : null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating debt:", error);
    return { error: error.message };
  }

  revalidatePath("/debts");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function recordLoanPayment(debtId: string, amount: number, paymentMonth: number, paymentYear: number, paymentDate: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Get current debt to find balance
  const { data: debt, error: fetchError } = await supabase.from("debts").select("current_balance").eq("id", debtId).single();
  
  if (fetchError || !debt) {
    return { error: fetchError?.message || "Debt not found" };
  }

  const newBalance = Math.max(0, Number(debt.current_balance) - amount);

  // Insert into loan_payments
  const { error: insertError } = await supabase.from("loan_payments").insert({
    debt_id: debtId,
    user_id: user.id,
    amount,
    payment_month: paymentMonth,
    payment_year: paymentYear,
    payment_date: paymentDate,
    remaining_balance_after: newBalance
  });

  if (insertError) {
    console.error("Error inserting loan payment:", insertError);
    return { error: insertError.message };
  }

  // Reduce outstanding balance
  const { error: updateError } = await supabase.from("debts").update({ current_balance: newBalance }).eq("id", debtId);

  if (updateError) {
    console.error("Error updating debt balance:", updateError);
    return { error: updateError.message };
  }

  revalidatePath("/debts");
  revalidatePath("/dashboard");
  return { success: true };
}
