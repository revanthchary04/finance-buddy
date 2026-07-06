import { IconTrendingUp, IconTrendingDown, IconWallet, IconActivity } from "@tabler/icons-react";
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
  transactionCount,
}: {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card/60 dark:*:data-[slot=card]:backdrop-blur-xl">
      {/* Total Income */}
      <Card className="@container/card border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Total Income</CardDescription>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10 gap-1 text-[11px] px-1.5 py-0.5">
              <IconTrendingUp className="size-3" /> +12.5%
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums text-emerald-500 mt-1">
            ₹{totalIncome.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className="flex items-center gap-1 font-medium text-emerald-500">
            Trending up this month <IconTrendingUp className="size-3.5" />
          </div>
          <div className="text-[11px]">Total recorded earnings</div>
        </CardFooter>
      </Card>

      {/* Total Expenses */}
      <Card className="@container/card border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Total Expenses</CardDescription>
            <Badge variant="outline" className="border-rose-500/30 text-rose-500 bg-rose-500/10 gap-1 text-[11px] px-1.5 py-0.5">
              <IconTrendingDown className="size-3" /> -5.2%
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums text-rose-500 mt-1">
            ₹{totalExpenses.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className="flex items-center gap-1 font-medium text-rose-500">
            Down 5.2% this period <IconTrendingDown className="size-3.5" />
          </div>
          <div className="text-[11px]">Operational expenses logged</div>
        </CardFooter>
      </Card>

      {/* Net Balance */}
      <Card className="@container/card border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Net Position</CardDescription>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 gap-1 text-[11px] px-1.5 py-0.5">
              <IconWallet className="size-3" /> +18.2%
            </Badge>
          </div>
          <CardTitle className={`text-2xl font-semibold tabular-nums mt-1 ${netBalance >= 0 ? "text-foreground" : "text-rose-500"}`}>
            ₹{netBalance.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className="flex items-center gap-1 font-medium text-blue-400">
            Strong cash retention <IconTrendingUp className="size-3.5" />
          </div>
          <div className="text-[11px]">Income minus expenses</div>
        </CardFooter>
      </Card>

      {/* Activity Count */}
      <Card className="@container/card border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Transactions</CardDescription>
            <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10 gap-1 text-[11px] px-1.5 py-0.5">
              <IconActivity className="size-3" /> +4.5%
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums mt-1">
            {transactionCount}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className="flex items-center gap-1 font-medium text-purple-400">
            Steady performance increase <IconTrendingUp className="size-3.5" />
          </div>
          <div className="text-[11px]">Database transaction items</div>
        </CardFooter>
      </Card>
    </div>
  );
}
