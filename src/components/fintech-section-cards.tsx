import { IconTrendingUp, IconTrendingDown, IconWallet, IconActivity } from "@tabler/icons-react";
import { Landmark, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FintechSectionCards({
  totalIncome,
  totalExpenses,
  netBalance,
  trueNetWorth = 0,
  transactionCount,
  totalDebt = 0,
  nextPayment = null,
  percentages = { income: "+0%", expenses: "+0%", net: "+0%", savings: "+0%", transactions: "+0%" }
}: {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  trueNetWorth?: number;
  transactionCount: number;
  totalDebt?: number;
  nextPayment?: any;
  percentages?: Record<string, string>;
}) {
  const isIncomePos = !percentages.income.startsWith("-");
  const isExpensePos = !percentages.expenses.startsWith("-");
  const isNetPos = !percentages.net.startsWith("-");
  const isTxPos = !percentages.transactions.startsWith("-");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card/60 dark:*:data-[slot=card]:backdrop-blur-xl">
      {/* Total Income */}
      <Card className="@container/card border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Total Income</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[11px] px-1.5 py-0.5 ${isIncomePos ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : "border-rose-500/30 text-rose-500 bg-rose-500/10"}`}>
              {isIncomePos ? <IconTrendingUp className="size-3" /> : <IconTrendingDown className="size-3" />} {percentages.income}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums text-emerald-500 mt-1">
            ₹{totalIncome.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className={`flex items-center gap-1 font-medium ${isIncomePos ? "text-emerald-500" : "text-rose-500"}`}>
            {isIncomePos ? "Trending up this month" : "Trending down this month"} {isIncomePos ? <IconTrendingUp className="size-3.5" /> : <IconTrendingDown className="size-3.5" />}
          </div>
          <div className="text-[11px]">Total recorded earnings</div>
        </CardFooter>
      </Card>

      {/* Total Expenses */}
      <Card className="@container/card border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Total Expenses</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[11px] px-1.5 py-0.5 ${!isExpensePos ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : "border-rose-500/30 text-rose-500 bg-rose-500/10"}`}>
              {isExpensePos ? <IconTrendingUp className="size-3" /> : <IconTrendingDown className="size-3" />} {percentages.expenses}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums text-rose-500 mt-1">
            ₹{totalExpenses.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className={`flex items-center gap-1 font-medium ${!isExpensePos ? "text-emerald-500" : "text-rose-500"}`}>
            {isExpensePos ? "Increased spending" : "Decreased spending"} {isExpensePos ? <IconTrendingUp className="size-3.5" /> : <IconTrendingDown className="size-3.5" />}
          </div>
          <div className="text-[11px]">Operational expenses logged</div>
        </CardFooter>
      </Card>

      {/* Net Balance */}
      <Card className="@container/card border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Net Position</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[11px] px-1.5 py-0.5 ${isNetPos ? "border-blue-500/30 text-blue-400 bg-blue-500/10" : "border-rose-500/30 text-rose-500 bg-rose-500/10"}`}>
              {isNetPos ? <IconTrendingUp className="size-3" /> : <IconTrendingDown className="size-3" />} {percentages.net}
            </Badge>
          </div>
          <CardTitle className={`text-2xl font-semibold tabular-nums mt-1 ${netBalance >= 0 ? "text-foreground" : "text-rose-500"}`}>
            ₹{netBalance.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className={`flex items-center gap-1 font-medium ${isNetPos ? "text-blue-400" : "text-rose-500"}`}>
            {isNetPos ? "Strong cash retention" : "Negative cash flow"} {isNetPos ? <IconTrendingUp className="size-3.5" /> : <IconTrendingDown className="size-3.5" />}
          </div>
          <div className="text-[11px]">Income minus expenses & savings</div>
        </CardFooter>
      </Card>

      {/* True Net Worth */}
      <Card className="@container/card border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">True Net Worth</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[11px] px-1.5 py-0.5 ${trueNetWorth >= 0 ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : "border-rose-500/30 text-rose-500 bg-rose-500/10"}`}>
              <IconWallet className="size-3" /> Overall
            </Badge>
          </div>
          <CardTitle className={`text-2xl font-semibold tabular-nums mt-1 ${trueNetWorth >= 0 ? "text-foreground" : "text-rose-500"}`}>
            ₹{trueNetWorth.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className={`flex items-center gap-1 font-medium ${trueNetWorth >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {trueNetWorth >= 0 ? "Positive standing" : "In the red"}
          </div>
          <div className="text-[11px]">Net minus Debt</div>
        </CardFooter>
      </Card>

      {/* Activity Count */}
      <Card className="@container/card border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Transactions</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[11px] px-1.5 py-0.5 ${isTxPos ? "border-purple-500/30 text-purple-400 bg-purple-500/10" : "border-muted/30 text-muted-foreground bg-muted/10"}`}>
              {isTxPos ? <IconTrendingUp className="size-3" /> : <IconTrendingDown className="size-3" />} {percentages.transactions}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums mt-1">
            {transactionCount}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className={`flex items-center gap-1 font-medium ${isTxPos ? "text-purple-400" : "text-muted-foreground"}`}>
            {isTxPos ? "Activity increased" : "Activity decreased"} {isTxPos ? <IconTrendingUp className="size-3.5" /> : <IconTrendingDown className="size-3.5" />}
          </div>
          <div className="text-[11px]">Items this month</div>
        </CardFooter>
      </Card>

      {/* Debt Summary */}
      <Card className="@container/card border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Debt Outstanding</CardDescription>
            <Badge variant="outline" className="border-orange-500/30 text-orange-500 bg-orange-500/10 gap-1 text-[11px] px-1.5 py-0.5">
              <Landmark className="size-3" /> Active
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums text-foreground mt-1">
            ₹{totalDebt.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          {nextPayment ? (
            <>
              <div className="flex items-center gap-1 font-medium text-orange-500">
                Next: ₹{Number(nextPayment.amount).toLocaleString('en-IN')} <Clock className="size-3.5" />
              </div>
              <div className="text-[11px]">Due {new Date(nextPayment.due_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1 font-medium text-muted-foreground">
                All clear! <IconTrendingDown className="size-3.5" />
              </div>
              <div className="text-[11px]">No upcoming EMI detected</div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
