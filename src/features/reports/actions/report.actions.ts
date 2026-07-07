"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Get monthly income vs expenses trend for the last X months
 */
export async function getMonthlyTrend(months: number = 6) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized", data: [] };

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  const startDateStr = startDate.toISOString().split("T")[0];

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("user_id", user.id)
    .gte("date", startDateStr)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching monthly trend:", error);
    return { error: error.message, data: [] };
  }


  // Aggregate by month (e.g., '2026-07')
  const monthlyData: Record<string, { income: number; expense: number; savings: number }> = {};

  transactions?.forEach((tx) => {
    const monthKey = tx.date.slice(0, 7);
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0, savings: 0 };
    }
    const amount = Number(tx.amount) || 0;
    if (tx.type === "income") {
      monthlyData[monthKey].income += amount;
    } else if (tx.type === "expense") {
      monthlyData[monthKey].expense += amount;
    }
  });



  // Convert map to array sorted by month
  const result = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, totals]) => ({
      month,
      ...totals,
    }));

  return { success: true, data: result };
}

/**
 * Get spending breakdown by category for a specific date range
 */
export async function getSpendingByCategory(startDate: string, endDate: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized", data: [] };

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("amount, categories(name)")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    console.error("Error fetching spending by category:", error);
    return { error: error.message, data: [] };
  }

  const categoryMap: Record<string, number> = {};

  transactions?.forEach((transaction) => {
    const tx = transaction as any;
    const catName = Array.isArray(tx.categories) 
      ? tx.categories[0]?.name 
      : tx.categories?.name || "Uncategorized";
      
    categoryMap[catName] = (categoryMap[catName] || 0) + (Number(tx.amount) || 0);
  });

  const result = Object.entries(categoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount); // Sort by highest spending

  return { success: true, data: result };
}

/**
 * Get high-level summary (Income, Expenses, Savings) for the last X months
 */
export async function getMonthlySummary(months: number = 1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized", data: null };

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  const startDateStr = startDate.toISOString().split("T")[0];

  const { data: transactions, error: txError } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("user_id", user.id)
    .gte("date", startDateStr);

  if (txError) {
    console.error("Error fetching transactions for summary:", txError);
    return { error: txError.message, data: null };
  }

  let totalIncome = 0;
  let totalExpenses = 0;

  transactions?.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    if (tx.type === "income") totalIncome += amount;
    else if (tx.type === "expense") totalExpenses += amount;
  });



  const netBalance = totalIncome - totalExpenses;

  return {
    success: true,
    data: {
      totalIncome,
      totalExpenses,
      netBalance
    }
  };
}
