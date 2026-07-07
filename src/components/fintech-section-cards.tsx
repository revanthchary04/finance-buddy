import { IconTrendingUp, IconTrendingDown, IconWallet, IconActivity } from "@tabler/icons-react";
import { Landmark, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FintechSectionCards({
  lifetimeSavings,
  trueNetWorth,
  monthlyIncome,
  monthlyExpenses,
  monthlyNet,
  totalDebt,
  transactionCount,
}: {
  lifetimeSavings: number;
  trueNetWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyNet: number;
  totalDebt: number;
  transactionCount: number;
}) {
  const isSavingsPos = lifetimeSavings >= 0;
  const isWorthPos = trueNetWorth >= 0;
  const isNetPos = monthlyNet >= 0;
  const hasDebt = totalDebt > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card/60 dark:*:data-[slot=card]:backdrop-blur-xl">
      {/* 1. Lifetime Savings (Primary - span 2 cols) */}
      <Card className="@container/card border-border/50 lg:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-sm text-foreground/80">Lifetime Savings</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[11px] px-1.5 py-0.5 ${isSavingsPos ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : "border-rose-500/30 text-rose-500 bg-rose-500/10"}`}>
              {isSavingsPos ? <IconTrendingUp className="size-3" /> : <IconTrendingDown className="size-3" />} Primary
            </Badge>
          </div>
          <CardTitle className={`text-3xl sm:text-4xl font-bold tabular-nums mt-2 ${isSavingsPos ? "text-emerald-500" : "text-rose-500"}`}>
            ₹{lifetimeSavings.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground pt-2">
          <div className="text-[12px] text-muted-foreground/80">Your accumulated wealth, all time</div>
        </CardFooter>
      </Card>

      {/* 2. True Net Worth */}
      <Card className="@container/card border-border/50 lg:col-span-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">True Net Worth</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[11px] px-1.5 py-0.5 ${isWorthPos ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : "border-rose-500/30 text-rose-500 bg-rose-500/10"}`}>
              <IconWallet className="size-3" /> Assets
            </Badge>
          </div>
          <CardTitle className={`text-2xl font-semibold tabular-nums mt-1 ${isWorthPos ? "text-foreground" : "text-rose-500"}`}>
            ₹{trueNetWorth.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className="text-[11px]">Savings + Goals + Assets - Debt</div>
        </CardFooter>
      </Card>

      {/* 3. This Month */}
      <Card className="@container/card border-border/50 lg:col-span-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">This Month</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[11px] px-1.5 py-0.5 ${isNetPos ? "border-blue-500/30 text-blue-400 bg-blue-500/10" : "border-rose-500/30 text-rose-500 bg-rose-500/10"}`}>
              {isNetPos ? <IconTrendingUp className="size-3" /> : <IconTrendingDown className="size-3" />} Net
            </Badge>
          </div>
          <CardTitle className={`text-2xl font-semibold tabular-nums mt-1 ${isNetPos ? "text-blue-400" : "text-rose-500"}`}>
            ₹{monthlyNet.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 text-xs text-muted-foreground pt-0">
          <div className="text-[11px] text-emerald-500">↑ ₹{monthlyIncome.toLocaleString("en-IN")} income this month</div>
          <div className="text-[11px] text-rose-500">↓ ₹{monthlyExpenses.toLocaleString("en-IN")} expenses this month</div>
        </CardFooter>
      </Card>

      {/* 4. Total Debt */}
      <Card className="@container/card border-border/50 lg:col-span-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Total Debt</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[11px] px-1.5 py-0.5 ${hasDebt ? "border-rose-500/30 text-rose-500 bg-rose-500/10" : "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"}`}>
              <Landmark className="size-3" /> {hasDebt ? "Active" : "Clear"}
            </Badge>
          </div>
          <CardTitle className={`text-2xl font-semibold tabular-nums mt-1 ${hasDebt ? "text-rose-500" : "text-emerald-500"}`}>
            {hasDebt ? `₹${totalDebt.toLocaleString("en-IN")}` : "Debt Free"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className="text-[11px]">Active liabilities to clear</div>
        </CardFooter>
      </Card>

      {/* 5. Transactions */}
      <Card className="@container/card border-border/50 lg:col-span-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Transactions</CardDescription>
            <Badge variant="outline" className="gap-1 text-[11px] px-1.5 py-0.5 border-purple-500/30 text-purple-400 bg-purple-500/10">
              <IconActivity className="size-3" /> Log
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums mt-1 text-foreground">
            {transactionCount}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className="text-[11px]">Total recorded entries</div>
        </CardFooter>
      </Card>

    </div>
  );
}
