"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign } from "lucide-react";

const COLORS = ["#10b981", "#f43f5e", "#3b82f6", "#a855f7", "#f59e0b", "#06b6d4"];

export function FinancialAnalytics({ transactions }: { transactions: any[] }) {
  // Aggregate data by category for Expense
  const categoryDataMap: Record<string, number> = {};
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t) => {
    const amount = Number(t.amount);
    if (t.type === "income") {
      totalIncome += amount;
    } else {
      totalExpense += amount;
      const catName = t.categories?.name || "General";
      categoryDataMap[catName] = (categoryDataMap[catName] || 0) + amount;
    }
  });

  const categoryChartData = Object.keys(categoryDataMap).map((key) => ({
    name: key,
    value: categoryDataMap[key],
  }));

  // Bar chart data (Monthly/Daily)
  const barChartData = [
    { name: "Income", amount: totalIncome },
    { name: "Expense", amount: totalExpense },
    { name: "Savings", amount: Math.max(totalIncome - totalExpense, 0) },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Metric Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cash Inflow</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-500">
              ₹{totalIncome.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total revenue generated</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cash Outflow</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-rose-500">
              ₹{totalExpense.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total operational spending</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Savings Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-500">
              {totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Net retention ratio</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Income vs Expense Bar Chart */}
        <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Financial Comparison</CardTitle>
            <CardDescription>Income vs Expenses vs Net Savings</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Amount"]}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === "Income" ? "#10b981" : entry.name === "Expense" ? "#f43f5e" : "#3b82f6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Category Breakdown Pie Chart */}
        <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Expense Breakdown</CardTitle>
            <CardDescription>Share of spending by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Spent"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-muted-foreground">
                No expense data available to build chart.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
