"use server";

import { createClient } from "@/lib/supabase/server";

export async function getFinancialSnapshot() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const db = await createClient();
  const userId = user.id;

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

  const { data: savingsAccounts } = await db
    .from('savings_accounts')
    .select('balance')
    .eq('user_id', userId);

  const totalSavingsPool = savingsAccounts?.reduce((sum, s) => sum + Number(s.balance), 0) || 0;
  const lifetimeSavings = allTimeIncome - allTimeExpenses - totalSavingsPool;

  const now = new Date();
  const currentMonthStr = now.toISOString().slice(0, 7);

  const monthlyIncome = allTransactions
    .filter(t => t.type === 'income' && t.date?.toString().slice(0, 7) === currentMonthStr)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const monthlyExpenses = allTransactions
    .filter(t => t.type === 'expense' && t.date?.toString().slice(0, 7) === currentMonthStr)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const { data: debts } = await db
    .from('debts')
    .select('current_balance')
    .eq('user_id', userId)
    .eq('status', 'active');
    
  const totalDebt = debts?.reduce((sum, d) => sum + Number(d.current_balance), 0) || 0;

  return {
    monthly_income: monthlyIncome,
    monthly_expenses: monthlyExpenses,
    lifetime_savings: lifetimeSavings,
    all_time_income: allTimeIncome,
    total_savings_pool: totalSavingsPool,
    total_debt: totalDebt,
  };
}
