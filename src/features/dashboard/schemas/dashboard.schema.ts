import { z } from "zod";

export const dashboardStatsSchema = z.object({
  total_income: z.number(),
  total_expenses: z.number(),
  net_balance: z.number(),
  transaction_count: z.number(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
