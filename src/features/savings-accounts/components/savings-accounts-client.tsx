"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavingsAccountCard } from "./savings-account-card";
import { AddSavingsAccountDialog } from "./add-savings-account-dialog";

export function SavingsAccountsClient({ accounts }: { accounts: any[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Accounts</h3>
          <p className="text-sm text-muted-foreground">Manage your dedicated savings pools.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {accounts?.length === 0 ? (
          <div className="col-span-full py-8 text-center border rounded-xl border-dashed">
            <p className="text-muted-foreground text-sm">No savings accounts created yet.</p>
          </div>
        ) : (
          accounts?.map((account) => (
            <SavingsAccountCard key={account.id} account={account} />
          ))
        )}
      </div>

      <AddSavingsAccountDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
