import { getCategories, getTransactions } from "@/features/transactions/actions/transaction.actions";
import { AddTransactionDialog } from "@/features/transactions/components/add-transaction-dialog";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

export default async function TransactionsPage() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories()
  ]);

  return (
    <div className="flex-1 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Transactions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage all your income deposits and expense payments.
          </p>
        </div>
        <AddTransactionDialog categories={categories} />
      </div>

      {/* Main Table Card */}
      <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Transaction History</CardTitle>
          <CardDescription>
            View, filter, or delete recorded income and expense items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl" />}>
            <TransactionsTable transactions={transactions} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
