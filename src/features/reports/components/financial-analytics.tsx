"use client";

import { useState, useEffect } from "react";
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
  Legend,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { getMonthlyTrend, getSpendingByCategory, getMonthlySummary } from "../actions/report.actions";

const COLORS = ["#10b981", "#f43f5e", "#3b82f6", "#a855f7", "#f59e0b", "#06b6d4", "#ec4899", "#8b5cf6"];

export function FinancialAnalytics() {
  const [monthsStr, setMonthsStr] = useState("6");
  const months = Number(monthsStr);

  const [trendData, setTrendData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>({ totalIncome: 0, totalExpenses: 0, totalSavings: 0, netBalance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      const startStr = startDate.toISOString().split("T")[0];
      const endStr = new Date().toISOString().split("T")[0];

      const [trendRes, catRes, sumRes] = await Promise.all([
        getMonthlyTrend(months),
        getSpendingByCategory(startStr, endStr),
        getMonthlySummary(months)
      ]);

      if (trendRes.success) setTrendData(trendRes.data || []);
      if (catRes.success) setCategoryData(catRes.data || []);
      if (sumRes.success && sumRes.data) setSummaryData(sumRes.data);
      
      setLoading(false);
    }
    loadData();
  }, [months]);

  const { totalIncome, totalExpenses, netBalance } = summaryData;

  const topCategories = categoryData.slice(0, 5); // Get top 5

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Report Period</h3>
        <Select value={monthsStr} onValueChange={setMonthsStr}>
          <SelectTrigger className="w-[180px] bg-card/60 backdrop-blur-xl border-border/50 shadow-xl">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-2xl border-border/60">
            <SelectItem value="3">Last 3 months</SelectItem>
            <SelectItem value="6">Last 6 months</SelectItem>
            <SelectItem value="12">Last 1 year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 text-muted-foreground animate-pulse">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p>Generating analytics...</p>
        </div>
      ) : (
        <>
          {/* Overview Metric Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-emerald-500">
                  ₹{totalIncome.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Cash inflow for period</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-rose-500">
                  ₹{totalExpenses.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Cash outflow for period</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Savings Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-blue-500">
                  {totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Net retention ratio</p>
              </CardContent>
            </Card>
          </div>

          {/* Visual Charts Grid 1 */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Income vs Expense Bar Chart */}
            <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Financial Comparison</CardTitle>
                <CardDescription>Monthly Income vs Expenses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => {
                        const [y, m] = val.split('-');
                        const d = new Date(Number(y), Number(m) - 1);
                        return d.toLocaleDateString('en-US', { month: 'short' });
                      }} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                        formatter={(value: any, name: any) => [`₹${Number(value).toLocaleString("en-IN")}`, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
                        labelFormatter={(label: any) => {
                          if (!label) return "";
                          const [y, m] = String(label).split('-');
                          const d = new Date(Number(y), Number(m) - 1);
                          return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                        }}
                      />
                      <Legend />
                      <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No data available</div>
                )}
              </CardContent>
            </Card>

            {/* Expense Category Breakdown Pie Chart */}
            <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Expense Breakdown</CardTitle>
                <CardDescription>Share of spending by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="amount"
                        nameKey="category"
                      >
                        {categoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                        formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Spent"]}
                      />
                      <Legend />
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

          {/* Visual Charts Grid 2 */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Spending Categories Horizontal Bar Chart */}
            <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Top Spending Categories</CardTitle>
                <CardDescription>Highest expenditure areas</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {topCategories.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topCategories} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                      <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                      <YAxis dataKey="category" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                        formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Spent"]}
                      />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                        {topCategories.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No data available</div>
                )}
              </CardContent>
            </Card>

            {/* Monthly Summary Table */}
            <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Monthly Summary</CardTitle>
                <CardDescription>Detailed month-by-month breakdown</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-left text-muted-foreground">
                      <th className="pb-3 font-medium">Month</th>
                      <th className="pb-3 font-medium text-right">Income</th>
                      <th className="pb-3 font-medium text-right">Expenses</th>
                      <th className="pb-3 font-medium text-right">Savings</th>
                      <th className="pb-3 font-medium text-right">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendData.length > 0 ? (
                      trendData.slice().reverse().map((row) => {
                        const net = row.income - row.expense - row.savings;
                        return (
                          <tr key={row.month} className="border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors">
                            <td className="py-3.5 font-medium">{(() => {
                              const [y, m] = row.month.split('-');
                              return new Date(Number(y), Number(m) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                            })()}</td>
                            <td className="py-3.5 text-right text-emerald-500 font-medium">₹{row.income.toLocaleString("en-IN")}</td>
                            <td className="py-3.5 text-right text-rose-500 font-medium">₹{row.expense.toLocaleString("en-IN")}</td>
                            <td className="py-3.5 text-right text-blue-500 font-medium">₹{row.savings.toLocaleString("en-IN")}</td>
                            <td className={`py-3.5 text-right font-bold ${net >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                              ₹{net.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
