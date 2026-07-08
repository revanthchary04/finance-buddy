"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Server action to securely log authentication events to the audit_log table.
 * Uses the admin client to bypass any RLS on the audit_log table for inserts.
 */
export async function logAuthEvent(userId: string, action: string) {
  if (!userId || !action) return;
  
  try {
    const adminClient = createAdminClient();
    
    await adminClient.from("audit_log").insert({
      actor_id: userId,
      action: action,
      target_type: "auth",
      target_id: userId, // The user is the target of their own auth event
    });
  } catch (error) {
    console.error(`Failed to log auth event (${action}) for user ${userId}:`, error);
  }
}

/**
 * Server action to fetch audit logs.
 * Strictly enforces that the caller has 'admin' or 'super_admin' roles.
 * Note: A Supabase cron job or pg_cron should be set up in production to delete logs older than 7 days.
 */
export async function getAuditLogs(page: number = 1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  // Use the admin client to fetch all audit logs since RLS might prevent normal clients 
  // from reading all logs, or we can use the regular client if RLS allows admins to view logs.
  // We'll use the admin client just to be safe and ensure all logs are returned.
  const adminClient = createAdminClient();
  
  const pageSize = 15;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data, count, error } = await adminClient
    .from("audit_log")
    .select(`
      id,
      action,
      created_at,
      actor_id,
      profiles (
        full_name,
        email,
        role
      )
    `, { count: 'exact' })
    .eq("target_type", "auth")
    .gte("created_at", oneWeekAgo.toISOString())
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching audit logs:", error);
    return { logs: [], totalCount: 0, totalPages: 0, currentPage: page };
  }

  // Transform data to flatten the profile fields for the datatable
  const logs = data.map((log: any) => ({
    id: log.id,
    action: log.action,
    created_at: log.created_at,
    actor_id: log.actor_id,
    user_name: log.profiles?.full_name || "Unknown",
    user_email: log.profiles?.email || "Unknown",
    user_role: log.profiles?.role || "user",
  }));

  const totalCount = count || 0;
  return { 
    logs, 
    totalCount, 
    totalPages: Math.ceil(totalCount / pageSize), 
    currentPage: page 
  };
}
