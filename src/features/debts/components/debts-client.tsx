"use client";

import { useTransition } from "react";
import { markPaymentPaid } from "../actions/debt.actions";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, IndianRupee, Landmark, CreditCard } from "lucide-react";

export function DebtsClient({ debts }: { debts: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handlePay = (paymentId: string, debtId: string, amount: number) => {
    startTransition(async () => {
      const res = await markPaymentPaid(paymentId, debtId, amount);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Payment marked as paid and expense logged!");
      }
    });
  };

  const getDebtIcon = (type: string) => {
    switch (type) {
      case "loan": return <Landmark className="w-5 h-5 text-blue-500" />;
      case "credit_card": return <CreditCard className="w-5 h-5 text-purple-500" />;
      default: return <IndianRupee className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {debts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground border rounded-xl border-dashed">
            No active liabilities tracked. Add one to get started!
          </div>
        ) : (
          debts.map((debt) => {
            const nextPayment = debt.debt_payments?.find((p: any) => p.status === 'pending');
            const isOverdue = nextPayment && new Date(nextPayment.due_date) < new Date();

            return (
              <Card key={debt.id} className="relative overflow-hidden group flex flex-col">
                <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-2">
                      {getDebtIcon(debt.type)}
                      <CardTitle className="text-lg font-semibold leading-tight">{debt.name}</CardTitle>
                    </div>
                    {debt.status === "active" ? (
                      <Badge variant="outline" className="text-emerald-500 bg-emerald-500/10">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Closed</Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm mt-2 flex justify-between">
                    <span>Principal: ₹{Number(debt.principal_amount).toLocaleString('en-IN')}</span>
                    {debt.interest_rate > 0 && <span>{debt.interest_rate}% p.a</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Outstanding</p>
                    <p className="text-3xl font-bold tracking-tight text-foreground">
                      ₹{Number(debt.current_balance).toLocaleString('en-IN')}
                    </p>
                  </div>
                  
                  {nextPayment && (
                    <div className={`mt-auto p-3 rounded-lg border ${isOverdue ? 'bg-rose-500/10 border-rose-500/20' : 'bg-secondary/50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          {isOverdue ? <AlertCircle className="w-4 h-4 text-rose-500" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
                          <p className={`text-sm font-semibold ${isOverdue ? 'text-rose-500' : 'text-foreground'}`}>
                            {isOverdue ? 'Overdue Payment' : 'Next Payment'}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(nextPayment.due_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold">₹{Number(nextPayment.amount).toLocaleString('en-IN')}</p>
                        <Button 
                          size="sm" 
                          disabled={isPending}
                          onClick={() => handlePay(nextPayment.id, debt.id, nextPayment.amount)}
                          className={isOverdue ? 'bg-rose-500 hover:bg-rose-600' : ''}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" /> Pay
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
