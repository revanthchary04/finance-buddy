import { getBudgets } from "@/features/budgets/actions/budget.actions";
import { getCategories } from "@/features/transactions/actions/transaction.actions";
import { getSavings } from "@/features/savings/actions/savings.actions";
import { AddBudgetDialog } from "@/features/budgets/components/add-budget-dialog";
import { BudgetCardList } from "@/features/budgets/components/budget-card-list";
import { SavingsSection } from "@/features/savings/components/savings-section";

export default async function BudgetsPage() {
  const budgets = await getBudgets();
  const categories = await getCategories();
  const savings = await getSavings();

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Budgets & Goals
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Set spending targets and get alerts when approaching category thresholds.
          </p>
        </div>
        <AddBudgetDialog categories={categories} />
      </div>

      {/* Cards List */}
      <BudgetCardList budgets={budgets} />

      {/* Savings Section */}
      <SavingsSection savings={savings} />
    </div>
  );
}
