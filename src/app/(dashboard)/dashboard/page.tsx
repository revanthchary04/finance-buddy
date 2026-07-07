import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, getRecentTransactions } from "@/features/dashboard/actions/dashboard.actions";
import { getCategories, getTransactions } from "@/features/transactions/actions/transaction.actions";
import { AddTransactionDialog } from "@/features/transactions/components/add-transaction-dialog";
import { FintechSectionCards } from "@/components/fintech-section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { DashboardGreeting } from "@/components/dashboard-greeting";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userName = user?.email || "User";
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
    if (profile?.full_name) userName = profile.full_name;
  }

  const stats = await getDashboardStats();
  const recentTransactions = await getRecentTransactions();
  const allTransactions = await getTransactions();
  const categories = await getCategories();

  const totalIncome = Number(stats?.total_income || 0);
  const totalExpenses = Number(stats?.total_expenses || 0);
  const netBalance = Number(stats?.net_balance || 0);
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

  return (
    <div className="flex-1 space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
        <DashboardGreeting userName={userName} />
        <div className="flex items-center gap-2">
          <AddTransactionDialog categories={categories} />
        </div>
      </div>
      
      {/* Row 1: 4 Horizontal Metric Cards in 1 Row */}
      <FintechSectionCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netBalance={netBalance}
        transactionCount={transactionCount}
      />

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
