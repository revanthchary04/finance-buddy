import { getDebts } from "@/features/debts/actions/debt.actions";
import { DebtsClient } from "@/features/debts/components/debts-client";
import { AddDebtDialog } from "@/features/debts/components/add-debt-dialog";
import { CreditCard } from "lucide-react";

export default async function DebtsPage() {
  const debts = await getDebts();

  return (
    <div className="flex-1 space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-primary" />
            Debts & Liabilities
          </h2>
          <p className="text-muted-foreground mt-1">Track loans, credit cards, and borrowing.</p>
        </div>
        <div className="flex items-center gap-2">
          <AddDebtDialog />
        </div>
      </div>
      
      <DebtsClient debts={debts || []} />
    </div>
  );
}
