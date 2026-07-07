"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const chartConfig = {
  transactions: {
    label: "Flows",
  },
  income: {
    label: "Income (₹)",
    color: "#10b981",
  },
  expense: {
    label: "Expense (₹)",
    color: "#f43f5e",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ transactions = [] }: { transactions?: any[] }) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("all")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("6m")
    }
  }, [isMobile])

  // Aggregate user transactions by month
  const monthMap: Record<string, { income: number; expense: number }> = {}

  let minDate = new Date();
  let maxDate = new Date(0); // Epoch start

  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);
    if (txDate < minDate) minDate = txDate;
    if (txDate > maxDate) maxDate = txDate;

    // YYYY-MM format
    const monthStr = txDate.toISOString().slice(0, 7);
    
    if (!monthMap[monthStr]) {
      monthMap[monthStr] = { income: 0, expense: 0 }
    }
    const amt = Number(tx.amount) || 0
    if (tx.type === "income") {
      monthMap[monthStr].income += amt
    } else {
      monthMap[monthStr].expense += amt
    }
  })

  // Determine date bounds based on timeRange
  const now = new Date();
  let monthsToInclude = 0; // 0 means all time

  if (timeRange === "6m") {
    monthsToInclude = 6;
  } else if (timeRange === "1y") {
    monthsToInclude = 12;
  }

  // Generate chart data array
  const chartData: { date: string; income: number; expense: number }[] = []
  
  if (monthsToInclude > 0) {
    // Generate exactly the requested number of months ending in current month
    for (let i = monthsToInclude - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = d.toISOString().slice(0, 7);
      chartData.push({
        date: monthKey,
        income: monthMap[monthKey]?.income || 0,
        expense: monthMap[monthKey]?.expense || 0,
      });
    }
  } else {
    // All time: from the earliest transaction to now
    if (transactions.length === 0) {
      // Fallback if no transactions
      const monthKey = now.toISOString().slice(0, 7);
      chartData.push({
        date: monthKey,
        income: 0,
        expense: 0,
      });
    } else {
      const startYear = minDate.getFullYear();
      const startMonth = minDate.getMonth();
      const endYear = now.getFullYear();
      const endMonth = now.getMonth();

      const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
      
      for (let i = 0; i < totalMonths; i++) {
        const d = new Date(startYear, startMonth + i, 1);
        const monthKey = d.toISOString().slice(0, 7);
        chartData.push({
          date: monthKey,
          income: monthMap[monthKey]?.income || 0,
          expense: monthMap[monthKey]?.expense || 0,
        });
      }
    }
  }

  return (
    <Card className="@container/main border-0 bg-transparent shadow-none">
      <CardHeader className="flex flex-col gap-4 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Cash Flow Trends</CardTitle>
          <CardDescription>
            Lifetime monthly income vs. expense performance
          </CardDescription>
        </div>
        <ToggleGroup
          type="single"
          value={timeRange}
          onValueChange={(val) => val && setTimeRange(val)}
          className="w-full sm:w-auto"
        >
          <ToggleGroupItem value="all" aria-label="Toggle All time">
            All time
          </ToggleGroupItem>
          <ToggleGroupItem value="1y" aria-label="Toggle 1y">
            Last 1 year
          </ToggleGroupItem>
          <ToggleGroupItem value="6m" aria-label="Toggle 6m">
            Last 6 months
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                // value is YYYY-MM
                const [year, month] = value.split("-");
                const date = new Date(Number(year), Number(month) - 1, 1);
                return date.toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric"
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(val) => `₹${val}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const [year, month] = value.split("-");
                    const date = new Date(Number(year), Number(month) - 1, 1);
                    return date.toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="expense"
              type="monotone"
              fill="url(#fillExpense)"
              stroke="#f43f5e"
              strokeWidth={2}
            />
            <Area
              dataKey="income"
              type="monotone"
              fill="url(#fillIncome)"
              stroke="#10b981"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
