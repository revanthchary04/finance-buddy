"use server";

import { createClient } from "@/lib/supabase/server";

export async function exportUserData(filter: 'monthly' | 'all', month?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let query = supabase
    .from("transactions")
    .select(`
      id,
      amount,
      type,
      description,
      date,
      location,
      time,
      category:categories (
        name
      )
    `)
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (filter === 'monthly' && month) {
    // month is expected in YYYY-MM format
    const startDate = `${month}-01`;
    const year = parseInt(month.split("-")[0]);
    const m = parseInt(month.split("-")[1]);
    const endDateObj = new Date(year, m, 0); // Last day of the month
    const endDate = `${year}-${String(m).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`;

    query = query.gte("date", startDate).lte("date", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching export data:", error);
    throw new Error("Failed to fetch data for export");
  }

  return data;
}
