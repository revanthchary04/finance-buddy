import { getBudgets } from "@/features/budgets/actions/budget.actions";
import { getCategories } from "@/features/transactions/actions/transaction.actions";
import { getWishlistItems } from "@/features/wishlist/actions/wishlist.actions";
import { AddBudgetDialog } from "@/features/budgets/components/add-budget-dialog";
import { BudgetCardList } from "@/features/budgets/components/budget-card-list";
import { WishlistClient } from "@/features/wishlist/components/wishlist-client";
import { AddWishlistDialog } from "@/features/wishlist/components/add-wishlist-dialog";
import { getSavingsAccounts } from "@/features/savings-accounts/actions/savings-accounts.actions";
import { SavingsAccountsClient } from "@/features/savings-accounts/components/savings-accounts-client";
import { getBankAccounts } from "@/features/savings-accounts/actions/bank.actions";
import { BankAccountsClient } from "@/features/savings-accounts/components/bank-accounts-client";
import { Heart, Landmark, Building2 } from "lucide-react";

import { Suspense } from "react";

export default async function BudgetsPage() {
  const [budgets, categories, wishlistItems, savingsAccounts, bankAccounts] = await Promise.all([
    getBudgets(),
    getCategories(),
    getWishlistItems(),
    getSavingsAccounts(),
    getBankAccounts()
  ]);

  return (
    <div className="flex-1 space-y-8 w-full max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Budgets & Targets
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Set spending targets and get alerts when approaching category thresholds.
            </p>
          </div>
          <AddBudgetDialog categories={categories} />
        </div>

        {/* Cards List */}
        <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl" />}>
          <BudgetCardList budgets={budgets} categories={categories} />
        </Suspense>
      </div>

      <div className="space-y-6 pt-4 border-t">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
          <div className="flex items-center gap-2">
            <Landmark className="w-8 h-8 text-primary fill-primary/20" />
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Savings Accounts
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your dedicated savings pools and track contributions.
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl" />}>
          <SavingsAccountsClient accounts={savingsAccounts} />
        </Suspense>
      </div>

      <div className="space-y-6 pt-4 border-t">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-500 fill-blue-500/20" />
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Bank Accounts
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Track liquid cash across savings, current, and deposit accounts.
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl" />}>
          <BankAccountsClient accounts={bankAccounts} />
        </Suspense>
      </div>

      <div className="space-y-6 pt-4 border-t">
        {/* Wishlist Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20" />
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Wishlist
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Track and fund your personal goals and future purchases.
              </p>
            </div>
          </div>
          <AddWishlistDialog />
        </div>

        {/* Wishlist Grid */}
        <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl" />}>
          <WishlistClient items={wishlistItems} />
        </Suspense>
      </div>
    </div>
  );
}
