"use client";

import { useEffect, useState } from "react";
import { getContributionHistory } from "../actions/savings-accounts.actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2, ArrowDownToLine } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SavingsHistoryDrawer({ open, onOpenChange, account }: { open: boolean, onOpenChange: (open: boolean) => void, account: any }) {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && account?.id) {
      setIsLoading(true);
      getContributionHistory(account.id)
        .then((data) => setHistory(data))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [open, account?.id]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{account.name} History</SheetTitle>
          <SheetDescription>
            All deposits made to this savings account.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-[calc(100vh-8rem)]">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <ArrowDownToLine className="h-8 w-8 mb-2 opacity-20" />
              <p>No contributions yet.</p>
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {history.map((tx) => (
                  <div key={tx.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium text-foreground">
                        Deposit
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        {new Date(tx.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                      {tx.note && (
                        <p className="text-sm text-muted-foreground mt-2 italic border-l-2 pl-2">
                          "{tx.note}"
                        </p>
                      )}
                    </div>
                    <div className="font-bold tabular-nums text-emerald-500">
                      +₹{Number(tx.amount).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
