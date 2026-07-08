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
import { getMonthlyTrend, getSpendingByCategory, getMonthlySummary, getAssetsByCategory } from "../actions/report.actions";

const COLORS = ["#10b981", "#f43f5e", "#3b82f6", "#a855f7", "#f59e0b", "#06b6d4", "#ec4899", "#8b5cf6"];

export function FinancialAnalytics() {
  const [monthsStr, setMonthsStr] = useState("6");
  const months = Number(monthsStr);

  const [trendData, setTrendData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [assetData, setAssetData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>({ totalIncome: 0, totalExpenses: 0, totalSavings: 0, netBalance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      const startStr = startDate.toISOString().split("T")[0];
      const endStr = new Date().toISOString().split("T")[0];

      const [trendRes, catRes, sumRes, assetRes] = await Promise.all([
        getMonthlyTrend(months),
        getSpendingByCategory(startStr, endStr),
        getMonthlySummary(months),
        getAssetsByCategory()
      ]);

      if (trendRes.success) setTrendData(trendRes.data || []);
      if (catRes.success) setCategoryData(catRes.data || []);
      if (sumRes.success && sumRes.data) setSummaryData(sumRes.data);
      if (assetRes.success) setAssetData(assetRes.data || []);
      
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

          {/* 2. Monthly Summary Table */}
          <div className="pt-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground/90 flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-blue-500 block"></span> Monthly Summary
            </h3>
            <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
              <CardContent className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 text-left text-muted-foreground bg-muted/20">
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Month</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Income</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Expenses</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trendData.length > 0 ? (
                        trendData.slice().reverse().map((row) => {
                          const net = row.income - row.expense;
                          return (
                            <tr key={row.month} className="border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-4 font-medium whitespace-nowrap">{(() => {
                                const [y, m] = row.month.split('-');
                                return new Date(Number(y), Number(m) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                              })()}</td>
                              <td className="px-6 py-4 text-right text-emerald-500 font-medium">₹{row.income.toLocaleString("en-IN")}</td>
                              <td className="px-6 py-4 text-right text-rose-500 font-medium">₹{row.expense.toLocaleString("en-IN")}</td>
                              <td className={`px-6 py-4 text-right font-bold ${net >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                {net > 0 ? "+" : ""}₹{net.toLocaleString("en-IN")}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-muted-foreground">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3. Top Spending Categories Bar Chart */}
          <div className="pt-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground/90 flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-rose-500 block"></span> Top Spending Categories
            </h3>
            <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
              <CardContent className="p-6 h-[400px]">
                {topCategories.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topCategories} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                      <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                      <YAxis dataKey="category" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={120} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                        formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Spent"]}
                      />
                      <Bar dataKey="amount" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={32}>
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
          </div>

          {/* 4. Expense Breakdown Pie Chart */}
          <div className="pt-8 pb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground/90 flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-emerald-500 block"></span> Expense Distribution
            </h3>
            <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
              <CardContent className="p-8 flex flex-col items-center justify-center">
                {categoryData.length > 0 ? (
                  <div className="h-[400px] w-full max-w-2xl">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={100}
                          outerRadius={140}
                          paddingAngle={3}
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
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-20">
                    No expense data available to build chart.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          
          {/* Assets Section */}
          <div className="grid gap-6 md:grid-cols-1 mt-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground/90 flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-yellow-500 block"></span> Assets (All Time)
            </h3>
            <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
              <CardContent className="p-6 h-[400px]">
                {assetData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={assetData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                      <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                      <YAxis dataKey="category" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={150} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                        formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Value"]}
                      />
                      <Bar dataKey="amount" fill="#eab308" radius={[0, 4, 4, 0]}>
                        {assetData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No asset data available</div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
