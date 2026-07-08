"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createSavingsAccount(name: string, description: string, initialBalance: number = 0) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("savings_accounts")
    .insert({
      user_id: user.id,
      name,
      description,
      balance: initialBalance
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating savings account:", error);
    throw new Error(error.message);
  }

  // If there's an initial balance, record it as a contribution
  if (initialBalance > 0) {
    await supabase.from("savings_contributions").insert({
      savings_account_id: data.id,
      user_id: user.id,
      amount: initialBalance,
      note: "Initial deposit"
    });
  }

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  return data;
}

export async function getSavingsAccounts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("savings_accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching savings accounts:", error);
    return [];
  }

  return data;
}

export async function addContribution(accountId: string, amount: number, note: string = "") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");
  if (amount <= 0) throw new Error("Amount must be greater than 0");

  // Fetch current balance
  const { data: account, error: accountError } = await supabase
    .from('savings_accounts')
    .select('balance')
    .eq('id', accountId)
    .eq('user_id', user.id)
    .single();

  if (accountError || !account) {
    throw new Error("Account not found");
  }

  // Update balance atomically
  const { error: updateError } = await supabase
    .from('savings_accounts')
    .update({ balance: Number(account.balance) + amount })
    .eq('id', accountId);

  if (updateError) {
    throw new Error("Failed to update balance");
  }

  // Insert contribution record
  const { data, error } = await supabase
    .from("savings_contributions")
    .insert({
      savings_account_id: accountId,
      user_id: user.id,
      amount,
      note
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding contribution:", error);
    throw new Error(error.message);
  }

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  return data;
}

export async function getContributionHistory(accountId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("savings_contributions")
    .select("*")
    .eq("savings_account_id", accountId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contribution history:", error);
    return [];
  }

  return data;
}

export async function updateSavingsAccount(id: string, name: string, description: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("savings_accounts")
    .update({
      name,
      description
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating savings account:", error);
    throw new Error(error.message);
  }

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  return { success: true };
}
