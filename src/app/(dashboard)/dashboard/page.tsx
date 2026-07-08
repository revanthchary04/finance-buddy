import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, getRecentTransactions } from "@/features/dashboard/actions/dashboard.actions";
import { getCategories, getTransactions } from "@/features/transactions/actions/transaction.actions";
import { getDebts, getLoanPayments } from "@/features/debts/actions/debt.actions";
import { AddTransactionDialog } from "@/features/transactions/components/add-transaction-dialog";
import { FintechSectionCards } from "@/components/fintech-section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { DashboardGreeting } from "@/components/dashboard-greeting";
import { FinancialWarningBanner } from "@/features/warnings/components/financial-warning-banner";
import { calculateBudgetWarnings } from "@/features/warnings/utils/financial-warnings";
import { getBudgets } from "@/features/budgets/actions/budget.actions";
import { getWishlistItems } from "@/features/wishlist/actions/wishlist.actions";
import { generateNotifications } from "@/features/notifications/actions/notification.actions";
import { RecentTransactionsList, DashboardWishlistWidget } from "@/features/dashboard/components/dashboard-widgets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, Clock, Landmark } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { OnboardingModal } from "@/components/onboarding-modal";
import { RefreshWrapper } from "@/components/refresh-wrapper";

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

  const [stats, recentTransactions, allTransactions, categories, debts, loanPayments, budgets, wishlistItems] = await Promise.all([
    getDashboardStats(),
    getRecentTransactions(),
    getTransactions(),
    getCategories(),
    getDebts(),
    getLoanPayments(),
    getBudgets(),
    getWishlistItems()
  ]);

  const lifetimeSavings = Number(stats?.lifetime_savings || 0);
  const trueNetWorth = Number(stats?.true_net_worth || 0);
  const monthlyIncome = Number(stats?.monthly_income || 0);
  const monthlyExpenses = Number(stats?.monthly_expenses || 0);
  const monthlyNet = Number(stats?.monthly_net || 0);
  const totalDebt = Number(stats?.total_debt || 0);
  const transactionCount = Number(stats?.transaction_count || 0);
  const totalSavingsPool = Number(stats?.total_savings_pool || 0);
  const totalBankBalance = Number(stats?.total_bank_balance || 0);


  const warningState = calculateBudgetWarnings(budgets, stats);
  const hasBudgets = budgets && budgets.length > 0;

  // Generate any automatic notifications based on current data
  await generateNotifications(budgets, stats, debts, wishlistItems);

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
        <RefreshWrapper fallback={<div className="h-[250px] animate-pulse bg-muted rounded-xl w-full" />}>
          <FintechSectionCards
            lifetimeSavings={lifetimeSavings}
            trueNetWorth={trueNetWorth}
            monthlyIncome={monthlyIncome}
            monthlyExpenses={monthlyExpenses}
            monthlyNet={monthlyNet}
            totalDebt={totalDebt}
            transactionCount={transactionCount}
            totalSavingsPool={totalSavingsPool}
            totalBankBalance={totalBankBalance}
          />
        </RefreshWrapper>
      </Suspense>

      <FinancialWarningBanner warningState={warningState} hasBudgets={hasBudgets} />

      {/* Row 2: Live Area Chart (Cash flow trends) */}
      <RefreshWrapper fallback={<div className="h-[400px] animate-pulse bg-muted rounded-xl w-full" />}>
        <div className="border border-border/50 shadow-xl rounded-xl overflow-hidden bg-card/60 backdrop-blur-xl">
          <ChartAreaInteractive transactions={[
            ...allTransactions,
            ...loanPayments.map(p => ({
              ...p,
              type: "expense",
              date: p.payment_date,
            }))
          ]} />
        </div>
      </RefreshWrapper>
      {/* Row 3: Split Layout (Transactions & Wishlist) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 border border-border/50 shadow-xl rounded-xl overflow-hidden bg-card/60 backdrop-blur-xl flex flex-col">
          <div className="p-4 border-b border-border/50 bg-muted/10">
            <h3 className="font-semibold text-sm">Recent Transactions</h3>
          </div>
          <RefreshWrapper fallback={<div className="h-[300px] animate-pulse bg-muted w-full" />}>
            <RecentTransactionsList transactions={recentTransactions} />
          </RefreshWrapper>
        </div>
        
        <div className="lg:col-span-2 border border-border/50 shadow-xl rounded-xl overflow-hidden bg-card/60 backdrop-blur-xl">
          <RefreshWrapper fallback={<div className="h-[300px] animate-pulse bg-muted w-full" />}>
            <DashboardWishlistWidget items={wishlistItems} />
          </RefreshWrapper>
        </div>
      </div>
    </div>
  );
}
