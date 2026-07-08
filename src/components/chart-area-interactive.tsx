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

const filters = [
  { label: 'Last 3 months', id: '3M' },
  { label: 'Last 6 months', id: '6M' },
  { label: 'Last 12 months', id: '12M' },
  { label: 'This Year', id: 'YTD' },
  { label: 'Custom', id: 'CUSTOM' },
]

export function ChartAreaInteractive({ transactions = [] }: { transactions?: any[] }) {
  const isMobile = useIsMobile()
  const [activeFilter, setActiveFilter] = React.useState<string>("3M")
  const [customStart, setCustomStart] = React.useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 6); return d.toISOString().slice(0, 7);
  });
  const [customEnd, setCustomEnd] = React.useState(() => new Date().toISOString().slice(0, 7));

  const dataMap: Record<string, { income: number; expense: number }> = {}

  let maxDate = new Date();
  let minDate = new Date();

  // Determine start/end dates based on filter
  if (activeFilter === "3M") {
    minDate.setMonth(maxDate.getMonth() - 2);
  } else if (activeFilter === "6M") {
    minDate.setMonth(maxDate.getMonth() - 5);
  } else if (activeFilter === "12M") {
    minDate.setMonth(maxDate.getMonth() - 11);
  } else if (activeFilter === "YTD") {
    minDate = new Date(maxDate.getFullYear(), 0, 1);
  } else if (activeFilter === "CUSTOM") {
    minDate = new Date(customStart + "-01");
    maxDate = new Date(customEnd + "-01");
  }

  // Ensure they are start of month
  minDate.setDate(1);
  minDate.setHours(0, 0, 0, 0);

  // For transactions, we filter anything before minDate, and for CUSTOM, anything after maxDate month end
  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);
    if (txDate < minDate) return;
    
    if (activeFilter === "CUSTOM") {
      const endMonthEnd = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0, 23, 59, 59);
      if (txDate > endMonthEnd) return;
    }

    const dateStr = txDate.toISOString().slice(0, 7);
    
    if (!dataMap[dateStr]) {
      dataMap[dateStr] = { income: 0, expense: 0 }
    }
    const amt = Number(tx.amount) || 0
    if (tx.type === "income") {
      dataMap[dateStr].income += amt
    } else if (tx.type === "expense") {
      dataMap[dateStr].expense += amt
    }
  })

  // Generate chart data array, filling in gaps
  const chartData: { date: string; income: number; expense: number }[] = []
  
  const startYear = minDate.getFullYear();
  const startMonth = minDate.getMonth();
  const endYear = maxDate.getFullYear();
  const endMonth = maxDate.getMonth();

  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  
  if (totalMonths > 0) {
    for (let i = 0; i < totalMonths; i++) {
      const d = new Date(startYear, startMonth + i, 1);
      // Because timezone might shift the month down a day, use local year/month to format manually
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const monthKey = `${yyyy}-${mm}`;
      
      chartData.push({
        date: monthKey,
        income: dataMap[monthKey]?.income || 0,
        expense: dataMap[monthKey]?.expense || 0,
      });
    }
  } else {
    // Fallback if invalid custom range
    const yyyy = maxDate.getFullYear();
    const mm = String(maxDate.getMonth() + 1).padStart(2, '0');
    chartData.push({
      date: `${yyyy}-${mm}`,
      income: 0,
      expense: 0,
    });
  }

  return (
    <Card className="@container/main border-0 bg-transparent shadow-none">
      <CardHeader className="flex flex-col gap-4 border-b py-5 md:flex-row md:items-start md:justify-between">
        <div className="grid flex-1 gap-1 text-center md:text-left">
          <CardTitle>Cash Flow Trends</CardTitle>
          <CardDescription>
            Monthly income vs. expense performance
          </CardDescription>
        </div>
        <div className="flex flex-col items-center md:items-end gap-3">
          <ToggleGroup
            type="single"
            value={activeFilter}
            onValueChange={(val) => val && setActiveFilter(val)}
            className="w-full sm:w-auto flex-wrap justify-center sm:justify-end bg-muted/30 p-1 rounded-lg"
          >
            {filters.map((filter) => (
              <ToggleGroupItem 
                key={filter.id} 
                value={filter.id} 
                aria-label={`Toggle ${filter.label}`}
                className="text-xs px-3 h-8 data-[state=on]:bg-background data-[state=on]:shadow-sm"
              >
                {filter.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {activeFilter === "CUSTOM" && (
            <div className="flex items-center gap-2 animate-in slide-in-from-top-2 fade-in">
              <input 
                type="month" 
                value={customStart} 
                onChange={e => setCustomStart(e.target.value)} 
                className="h-8 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <span className="text-muted-foreground text-xs">to</span>
              <input 
                type="month" 
                value={customEnd} 
                onChange={e => setCustomEnd(e.target.value)} 
                className="h-8 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          )}
        </div>
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
                const [year, month] = value.split("-");
                const date = new Date(Number(year), Number(month) - 1, 1);
                return date.toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric"
                });
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
                    });
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
