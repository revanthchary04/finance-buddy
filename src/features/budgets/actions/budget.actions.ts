"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getBudgets() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("budgets")
    .select("*, categories(name, color)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }

  // Calculate spent amount for each budget
  const budgetsWithSpent = await Promise.all(
    data.map(async (budget) => {
      let query = supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", user.id)
        .eq("type", "expense")
        .gte("date", budget.start_date)
        .lte("date", budget.end_date);

      if (budget.category_id) {
        query = query.eq("category_id", budget.category_id);
      }

      const { data: txs } = await query;
      const spent = txs?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      return {
        ...budget,
        spent,
      };
    })
  );

  return budgetsWithSpent;
}

export async function createBudget(data: {
  name: string;
  amount: number;
  category_id?: string;
  period: "weekly" | "monthly" | "yearly";
  start_date: string;
  end_date: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("budgets").insert({
    user_id: user.id,
    name: data.name,
    amount: data.amount,
    category_id: data.category_id || null,
    period: data.period,
    start_date: data.start_date,
    end_date: data.end_date,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteBudget(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("budgets").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  return { success: true };
}
