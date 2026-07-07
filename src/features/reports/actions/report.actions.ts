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

  const { data: savingsData, error: svError } = await supabase
    .from("savings")
    .select("current_amount, month")
    .eq("user_id", user.id)
    .gte("month", startDateStr);

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

  savingsData?.forEach((sv) => {
    const monthKey = sv.month.slice(0, 7);
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0, savings: 0 };
    }
    monthlyData[monthKey].savings += Number(sv.current_amount) || 0;
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

  // Also query savings tables for true net calculations
  const { data: savings, error: svError } = await supabase
    .from("savings")
    .select("current_amount")
    .eq("user_id", user.id)
    .gte("month", startDateStr);

  if (svError) {
    console.error("Error fetching savings for summary:", svError);
    return { error: svError.message, data: null };
  }

  let totalIncome = 0;
  let totalExpenses = 0;

  transactions?.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    if (tx.type === "income") totalIncome += amount;
    else if (tx.type === "expense") totalExpenses += amount;
  });

  let totalSavings = 0;
  savings?.forEach((s) => {
    totalSavings += Number(s.current_amount) || 0;
  });

  const netBalance = totalIncome - totalExpenses - totalSavings;

  return {
    success: true,
    data: {
      totalIncome,
      totalExpenses,
      totalSavings,
      netBalance
    }
  };
}
