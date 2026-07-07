"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createFeatureRequest(data: { title: string; description: string; reference_links?: string[] }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("feature_requests").insert({
    user_id: user.id,
    title: data.title,
    description: data.description,
    reference_links: data.reference_links || [],
    status: 'pending'
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/feature-requests");
  revalidatePath("/admin/features");
  return { success: true };
}

export async function getUserFeatureRequests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("feature_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feature requests:", error);
    return [];
  }

  return data;
}

export async function getAllFeatureRequests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return [];
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("feature_requests")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all feature requests:", error);
    return [];
  }

  return data;
}

export async function updateFeatureRequestStatus(id: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return { error: "Unauthorized" };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("feature_requests")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/feature-requests");
  revalidatePath("/admin/features");
  return { success: true };
}
