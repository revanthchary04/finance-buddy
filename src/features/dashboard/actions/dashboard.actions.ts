"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .rpc("get_dashboard_stats", { p_user_id: user.id });

  if (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }

  return data;
}

export async function getRecentTransactions(limit = 5) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      categories(name, icon, color)
    `)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent transactions:", error);
    return [];
  }

  return data;
}
