"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const now = new Date();
  const currentMonthStr = now.toISOString().slice(0, 7);
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthStr = lastMonthDate.toISOString().slice(0, 7);

  const { data: txs, error: txError } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("user_id", user.id);

  if (txError) {
    console.error("Error fetching transactions for stats:", txError);
    return null;
  }

  const { data: savings, error: svError } = await supabase
    .from("savings")
    .select("current_amount, month")
    .eq("user_id", user.id);

  if (svError) {
    console.error("Error fetching savings for stats:", svError);
    return null;
  }

  let currentIncome = 0, currentExpenses = 0, currentTxCount = 0;
  let lastIncome = 0, lastExpenses = 0, lastTxCount = 0;

  txs?.forEach(tx => {
    const txMonth = tx.date.slice(0, 7);
    const amt = Number(tx.amount) || 0;
    if (txMonth === currentMonthStr) {
      currentTxCount++;
      if (tx.type === "income") currentIncome += amt;
      else currentExpenses += amt;
    } else if (txMonth === lastMonthStr) {
      lastTxCount++;
      if (tx.type === "income") lastIncome += amt;
      else lastExpenses += amt;
    }
  });

  let currentSavings = 0, lastSavings = 0;
  savings?.forEach(s => {
    const sMonth = s.month.slice(0, 7);
    if (sMonth === currentMonthStr) currentSavings += Number(s.current_amount) || 0;
    else if (sMonth === lastMonthStr) lastSavings += Number(s.current_amount) || 0;
  });

  const currentNetBalance = currentIncome - currentExpenses - currentSavings;
  const lastNetBalance = lastIncome - lastExpenses - lastSavings;

  const calculatePct = (current: number, previous: number) => {
    if (previous === 0) return "+0%";
    const pct = ((current - previous) / previous) * 100;
    return `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`;
  };

  return {
    total_income: currentIncome,
    total_expenses: currentExpenses,
    net_balance: currentNetBalance,
    total_savings: currentSavings,
    transaction_count: currentTxCount,
    percentages: {
      income: calculatePct(currentIncome, lastIncome),
      expenses: calculatePct(currentExpenses, lastExpenses),
      net: calculatePct(currentNetBalance, lastNetBalance),
      savings: calculatePct(currentSavings, lastSavings),
      transactions: calculatePct(currentTxCount, lastTxCount)
    }
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
