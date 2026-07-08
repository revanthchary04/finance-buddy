"use server";

import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const db = await createClient();
  const userId = user.id;

  // 1. Fetch ALL transactions ever, no date filter
  const { data: allTransactions, error: txError } = await db
    .from("transactions")
    .select("amount, type, date")
    .eq("user_id", userId);

  if (txError) return null;

  const allTimeIncome = allTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const allTimeExpenses = allTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const allTimeAssets = allTransactions
    .filter(t => t.type === "asset")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  // Fetch total savings pool
  const { data: savingsAccounts } = await db
    .from('savings_accounts')
    .select('balance')
    .eq('user_id', userId);

  const totalSavingsPool = savingsAccounts?.reduce((sum, s) => sum + Number(s.balance), 0) || 0;

  // Fetch total bank accounts balance
  const { data: bankAccounts } = await db
    .from('bank_accounts')
    .select('current_balance')
    .eq('user_id', userId);

  const totalBankBalance = bankAccounts?.reduce((sum, b) => sum + Number(b.current_balance), 0) || 0;

  // Update Lifetime Savings — raw surplus
  const lifetimeSavings = allTimeIncome - allTimeExpenses;

  // 2. True Net Worth (Assets view)
  const { data: debts } = await db
    .from('debts')
    .select('current_balance')
    .eq('user_id', userId)
    .eq('status', 'active');
    
  const totalDebt = debts?.reduce((sum, d) => sum + Number(d.current_balance), 0) || 0;

  // Update True Net Worth
  // totalAssets = totalSavingsPool + totalBankBalance + asset transactions
  const totalAssets = totalSavingsPool + totalBankBalance + allTimeAssets;
  const trueNetWorth = totalAssets - totalDebt;

  // 3. Monthly snapshot (context only)
  const now = new Date();
  const currentMonthStr = now.toISOString().slice(0, 7);

  const monthlyIncome = allTransactions
    .filter(t => t.type === 'income' && t.date?.toString().slice(0, 7) === currentMonthStr)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const monthlyExpenses = allTransactions
    .filter(t => t.type === 'expense' && t.date?.toString().slice(0, 7) === currentMonthStr)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const monthlyNet = monthlyIncome - monthlyExpenses;

  // 4. Return new object shape
  return {
    lifetime_savings: lifetimeSavings,
    true_net_worth: trueNetWorth,
    all_time_income: allTimeIncome,
    all_time_expenses: allTimeExpenses,
    monthly_income: monthlyIncome,
    monthly_expenses: monthlyExpenses,
    monthly_net: monthlyNet,
    total_debt: totalDebt,
    transaction_count: allTransactions.length,
    total_savings_pool: totalSavingsPool,
    total_bank_balance: totalBankBalance,
  };
}

export async function getRecentTransactions(limit = 5) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      categories(name, icon, color)
    `)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent transactions:", error);
    return [];
  }

  return data;
}
