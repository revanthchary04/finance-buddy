"use client";

import { useTransition } from "react";
import { deleteBankAccount } from "../actions/bank.actions";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Pencil, Trash2 } from "lucide-react";
import { AddBankAccountDialog } from "./add-bank-account-dialog";

export function BankAccountsClient({ accounts }: { accounts: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteBankAccount(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Bank account removed");
      }
    });
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-end">
        <AddBankAccountDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground border rounded-xl border-dashed">
            No bank accounts linked. Add one to track your liquid assets!
          </div>
        ) : (
          accounts.map((account) => (
            <Card key={account.id} className="relative overflow-hidden group flex flex-col hover:border-blue-500/50 transition-colors">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Building2 className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold leading-tight">{account.bank_name}</CardTitle>
                      <CardDescription className="text-sm">
                        {account.account_type} {account.last_four_digits ? `•••• ${account.last_four_digits}` : ''}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AddBankAccountDialog editData={account} trigger={
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    } />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      disabled={isPending}
                      onClick={() => handleDelete(account.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-4">
                <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  ₹{Number(account.current_balance).toLocaleString('en-IN')}
                </p>
                {account.notes && (
                  <p className="mt-4 text-sm text-muted-foreground border-t border-border/50 pt-3">
                    {account.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
