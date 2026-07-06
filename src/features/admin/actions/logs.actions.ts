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
 */
export async function getAuditLogs() {
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
  
  const { data, error } = await adminClient
    .from("audit_log")
    .select(`
      id,
      action,
      created_at,
      actor_id,
      profiles (
        full_name,
        email
      )
    `)
    .eq("target_type", "auth")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }

  // Transform data to flatten the profile fields for the datatable
  return data.map((log: any) => ({
    id: log.id,
    action: log.action,
    created_at: log.created_at,
    user_name: log.profiles?.full_name || "Unknown",
    user_email: log.profiles?.email || "Unknown",
  }));
}
