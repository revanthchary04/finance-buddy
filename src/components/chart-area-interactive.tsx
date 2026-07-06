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
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  // Aggregate user transactions by date
  const dateMap: Record<string, { income: number; expense: number }> = {}

  transactions.forEach((tx) => {
    const dateStr = typeof tx.date === "string" ? tx.date.split("T")[0] : new Date(tx.date).toISOString().split("T")[0]
    if (!dateMap[dateStr]) {
      dateMap[dateStr] = { income: 0, expense: 0 }
    }
    const amt = Number(tx.amount) || 0
    if (tx.type === "income") {
      dateMap[dateStr].income += amt
    } else {
      dateMap[dateStr].expense += amt
    }
  })

  // Generate zero baseline dates if no data or fill gaps for the time range
  const daysToInclude = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
  const now = new Date()
  const chartData: { date: string; income: number; expense: number }[] = []

  for (let i = daysToInclude - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateKey = d.toISOString().split("T")[0]
    chartData.push({
      date: dateKey,
      income: dateMap[dateKey]?.income || 0,
      expense: dateMap[dateKey]?.expense || 0,
    })
  }

  return (
    <Card className="@container/main border-0 bg-transparent shadow-none">
      <CardHeader className="flex flex-col gap-4 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Cash Flow Trends</CardTitle>
          <CardDescription>
            Daily income vs. expense performance chart
          </CardDescription>
        </div>
        <ToggleGroup
          type="single"
          value={timeRange}
          onValueChange={(val) => val && setTimeRange(val)}
          className="w-full sm:w-auto"
        >
          <ToggleGroupItem value="90d" aria-label="Toggle 90d">
            Last 3 months
          </ToggleGroupItem>
          <ToggleGroupItem value="30d" aria-label="Toggle 30d">
            Last 30 days
          </ToggleGroupItem>
          <ToggleGroupItem value="7d" aria-label="Toggle 7d">
            Last 7 days
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
                const date = new Date(value)
                return date.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
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
                    return new Date(value).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
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
