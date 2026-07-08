"use client";

import { useState, useTransition } from "react";
import { markPaymentPaid } from "../actions/debt.actions";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, IndianRupee, Landmark, CreditCard, Pencil } from "lucide-react";
import { AddDebtDialog } from "./add-debt-dialog";
import { RecordLoanPaymentDialog } from "./record-loan-payment-dialog";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

export function DebtsClient({ debts }: { debts: any[] }) {

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
          debts.map((debt) => (
            <DebtCard key={debt.id} debt={debt} />
          ))
        )}
      </div>
    </div>
  );
}

function DebtCard({ debt }: { debt: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const getDebtIcon = (type: string) => {
    switch (type) {
      case "loan": return <Landmark className="w-5 h-5 text-blue-500" />;
      case "credit_card": return <CreditCard className="w-5 h-5 text-purple-500" />;
      default: return <IndianRupee className="w-5 h-5 text-orange-500" />;
    }
  };

  const payments = debt.loan_payments || [];
  const sortedPayments = [...payments].sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
  
  const principal = Number(debt.principal_amount) || 0;
  const currentBalance = Number(debt.current_balance) || 0;
  const paidOff = principal - currentBalance;
  const percentPaid = principal > 0 ? Math.max(0, Math.min(100, (paidOff / principal) * 100)) : 0;

  return (
    <Card className="relative overflow-hidden group flex flex-col hover:border-border/80 transition-colors">
      <CardHeader className="pb-3 border-b border-border/50 bg-muted/10 p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-lg border shadow-sm">
              {getDebtIcon(debt.type)}
            </div>
            <div>
              <CardTitle className="text-base font-semibold leading-tight">{debt.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 font-normal uppercase tracking-wider">
                  {debt.type.replace('_', ' ')}
                </Badge>
                {debt.interest_rate > 0 && <span>{debt.interest_rate}% p.a</span>}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tracking-tight text-foreground">
              ₹{currentBalance.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">outstanding</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(percentPaid)}% paid off</span>
            <span>Total: ₹{principal.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-1.5 w-full bg-secondary overflow-hidden rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${percentPaid}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <RecordLoanPaymentDialog debt={debt} trigger={
            <Button size="sm" variant="outline" className="h-8 gap-1 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 w-full justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" /> Record Payment
            </Button>
          } />
          
          <div className="flex items-center gap-1 shrink-0">
            <AddDebtDialog editData={debt} trigger={
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500">
                <Pencil className="h-4 w-4" />
              </Button>
            } />
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-rose-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            {isExpanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Hide Details</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> Show Details</>
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="pt-2 space-y-4 animate-in slide-in-from-top-2 duration-200 fade-in">
            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-lg border">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Start Date</p>
                <p className="font-medium">{debt.start_date ? new Date(debt.start_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Min. Due Amount</p>
                <p className="font-medium">₹{Number(debt.min_due || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>

            {sortedPayments.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Payments</p>
                <div className="space-y-1.5">
                  {sortedPayments.slice(0, 3).map((p: any) => (
                    <div key={p.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted/50">
                      <span className="text-muted-foreground">
                        {new Date(0, p.payment_month - 1).toLocaleString('en-IN', { month: 'short' })} {p.payment_year}
                      </span>
                      <span className="font-medium text-emerald-600">₹{Number(p.amount).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                {sortedPayments.length > 3 && (
                  <Button variant="link" size="sm" className="w-full text-xs h-auto p-0 mt-1 text-muted-foreground hover:text-foreground">
                    View Full Payment History
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2 italic">No payments recorded yet</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
