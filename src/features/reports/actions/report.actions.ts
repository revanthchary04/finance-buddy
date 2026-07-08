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

  const { data: loanPayments, error: lpError } = await supabase
    .from("loan_payments")
    .select("amount, payment_date, payment_month, payment_year")
    .eq("user_id", user.id)
    .gte("payment_date", startDateStr)
    .order("payment_date", { ascending: true });

  if (lpError) {
    console.error("Error fetching loan payments trend:", lpError);
  }


  // Aggregate by month (e.g., '2026-07')
  const monthlyData: Record<string, { income: number; expense: number; savings: number }> = {};
  
  // Pre-fill all months in the range
  const endDate = new Date();
  let current = new Date(startDate);
  current.setDate(1); // Set to 1st of month to avoid overflow bugs
  while (current <= endDate || (current.getMonth() === endDate.getMonth() && current.getFullYear() === endDate.getFullYear())) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    monthlyData[`${y}-${m}`] = { income: 0, expense: 0, savings: 0 };
    current.setMonth(current.getMonth() + 1);
  }

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

  loanPayments?.forEach((lp) => {
    const mm = String(lp.payment_month).padStart(2, '0');
    const monthKey = `${lp.payment_year}-${mm}`;
    
    // Only include if it falls within our requested date range (roughly)
    // Actually we can just include it if it's in the data fetched
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0, savings: 0 };
    }
    monthlyData[monthKey].expense += (Number(lp.amount) || 0);
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

  const { data: loanPayments, error: lpError } = await supabase
    .from("loan_payments")
    .select("amount")
    .eq("user_id", user.id)
    .gte("payment_date", startDateStr);

  if (lpError) {
    console.error("Error fetching loan payments for summary:", lpError);
  }

  let totalIncome = 0;
  let totalExpenses = 0;

  transactions?.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    if (tx.type === "income") totalIncome += amount;
    else if (tx.type === "expense") totalExpenses += amount;
  });

  loanPayments?.forEach((lp) => {
    totalExpenses += Number(lp.amount) || 0;
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

/**
 * Get asset breakdown by category (all time)
 */
export async function getAssetsByCategory() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized", data: [] };

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("amount, categories(name)")
    .eq("user_id", user.id)
    .eq("type", "asset");

  if (error) {
    console.error("Error fetching assets by category:", error);
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
    .sort((a, b) => b.amount - a.amount);

  return { success: true, data: result };
}
