import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, getRecentTransactions } from "@/features/dashboard/actions/dashboard.actions";
import { getCategories, getTransactions } from "@/features/transactions/actions/transaction.actions";
import { getDebts } from "@/features/debts/actions/debt.actions";
import { AddTransactionDialog } from "@/features/transactions/components/add-transaction-dialog";
import { FintechSectionCards } from "@/components/fintech-section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { DashboardGreeting } from "@/components/dashboard-greeting";
import { FinancialWarningBanner } from "@/features/warnings/components/financial-warning-banner";
import { calculateWarningLevel } from "@/features/warnings/utils/financial-warnings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, Clock, Landmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { OnboardingModal } from "@/components/onboarding-modal";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userName = user?.email || "User";
  let profile = null;
  if (user) {
    const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = p;
    if (profile?.full_name) userName = profile.full_name;
  }

  const [stats, recentTransactions, allTransactions, categories, debts] = await Promise.all([
    getDashboardStats(),
    getRecentTransactions(),
    getTransactions(),
    getCategories(),
    getDebts()
  ]);

  const lifetimeSavings = Number(stats?.lifetime_savings || 0);
  const trueNetWorth = Number(stats?.true_net_worth || 0);
  const monthlyIncome = Number(stats?.monthly_income || 0);
  const monthlyExpenses = Number(stats?.monthly_expenses || 0);
  const monthlyNet = Number(stats?.monthly_net || 0);
  const totalDebt = Number(stats?.total_debt || 0);
  const transactionCount = Number(stats?.transaction_count || 0);

  // Map real database transactions to dashboard DataTable format
  const tableData = recentTransactions.map((tx, idx) => ({
    id: idx + 1,
    header: tx.description || tx.categories?.name || "Transaction",
    type: tx.categories?.name || (tx.type === "income" ? "Deposit" : "Payment"),
    status: tx.type === "income" ? "Done" : "In Process",
    target: `₹${Number(tx.amount).toLocaleString("en-IN")}`,
    limit: tx.type === "income" ? "Credit" : "Debit",
  }));

  const warning = calculateWarningLevel(stats);

  const isNewUser = profile?.onboarding_completed === false && 
    new Date(profile.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {isNewUser && (
        <OnboardingModal profile={profile} user={user} />
      )}
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
        <DashboardGreeting userName={userName} />
        <div className="flex items-center gap-2">
          <AddTransactionDialog categories={categories} />
        </div>
      </div>
      
      {/* Row 1: Dashboard Metric Cards */}
      <Suspense fallback={<div className="h-32 animate-pulse bg-muted rounded-xl" />}>
        <FintechSectionCards
          lifetimeSavings={lifetimeSavings}
          trueNetWorth={trueNetWorth}
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
          monthlyNet={monthlyNet}
          totalDebt={totalDebt}
          transactionCount={transactionCount}
        />
      </Suspense>

      <FinancialWarningBanner warning={warning} />

      {/* Row 2: Live Area Chart (Cash flow trends) */}
      <div className="border border-border/50 shadow-xl rounded-xl overflow-hidden bg-card/60 backdrop-blur-xl">
        <ChartAreaInteractive transactions={allTransactions} />
      </div>
      {/* Row 3: Live DataTable (Recent Transactions) */}
      <div className="border border-border/50 shadow-xl rounded-xl overflow-hidden bg-card/60 backdrop-blur-xl py-4">
        <DataTable data={tableData} />
      </div>
    </div>
  );
}
