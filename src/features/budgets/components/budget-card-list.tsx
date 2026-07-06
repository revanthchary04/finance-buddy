"use client";

import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteBudget } from "../actions/budget.actions";
import { toast } from "sonner";
import { Trash2, AlertTriangle, PiggyBank, Calendar } from "lucide-react";

export function BudgetCardList({ budgets }: { budgets: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteBudget(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Budget target removed");
      }
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((b) => {
        const spent = Number(b.spent || 0);
        const limit = Number(b.amount || 0);
        const percentage = Math.min(Math.round((spent / limit) * 100), 100);
        const isOver = spent > limit;
        const isWarning = percentage >= 80 && !isOver;

        return (
          <Card key={b.id} className="border-border/50 shadow-md bg-card/60 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">{b.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {b.period.toUpperCase()} • {b.categories?.name || "All Expenses"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(b.id)}
                  disabled={isPending}
                  className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Amounts */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-extrabold">₹{spent.toLocaleString("en-IN")}</span>
                  <span className="text-xs text-muted-foreground"> / ₹{limit.toLocaleString("en-IN")}</span>
                </div>
                <Badge
                  className={
                    isOver
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      : isWarning
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  }
                >
                  {percentage}% Used
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <Progress
                  value={percentage}
                  className={`h-2.5 ${
                    isOver ? "[&>div]:bg-rose-500" : isWarning ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"
                  }`}
                />
              </div>

              {/* Overbudget warning */}
              {isOver && (
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Exceeded limit by ₹{(spent - limit).toLocaleString("en-IN")}!</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {budgets.length === 0 && (
        <div className="col-span-full text-center py-16 border border-dashed rounded-xl bg-background/30">
          <PiggyBank className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
          <h3 className="text-base font-semibold">No Active Budgets</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Create a budget limit above to start monitoring category spending!
          </p>
        </div>
      )}
    </div>
  );
}
