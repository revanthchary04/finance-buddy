"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getPendingUsers() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return [];
  }

  // Use Admin Client to bypass RLS in case JWT role claim is stale
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("profiles")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending users:", error);
    return [];
  }

  return data;
}

export async function approveUser(userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return { error: "Unauthorized: Admin privileges required." };
  }

  // Update status directly via admin client to bypass RLS
  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("profiles")
    .update({ status: "approved" })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  // Fetch target user's profile to send email notification and update app_metadata
  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("email, full_name, role")
    .eq("id", userId)
    .single();

  if (targetProfile?.role) {
    await adminClient.auth.admin.updateUserById(userId, {
      app_metadata: { user_role: targetProfile.role }
    });
  }

  if (targetProfile?.email) {
    try {
      // Trigger Supabase's native email system to send a Magic Link
      await adminClient.auth.signInWithOtp({
        email: targetProfile.email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
        },
      });
    } catch (e) {
      console.error("Failed to send Supabase magic link:", e);
    }
  }

  revalidatePath("/admin/pending");
  revalidatePath("/admin/users");
  revalidatePath("/admin");

  return { success: true };
}

export async function rejectUser(userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return { error: "Unauthorized: Admin privileges required." };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("profiles")
    .update({ status: "rejected" })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  // Rejection doesn't have a native Supabase email template, so it fails silently.
  // The user simply cannot log in since their status is "rejected".

  revalidatePath("/admin/pending");
  revalidatePath("/admin/users");
  revalidatePath("/admin");

  return { success: true };
}

export async function getAllUsers() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return [];
  }

  // Use Admin Client to bypass RLS in case JWT role claim is stale
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all users:", error);
    return [];
  }

  return data;
}

export async function updateUserRole(targetUserId: string, newRole: "user" | "admin" | "super_admin") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "super_admin") {
    return { error: "Only Super Admins can change user roles." };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("profiles")
    .update({ role: newRole })
    .eq("id", targetUserId);

  if (error) {
    return { error: error.message };
  }

  await adminClient.auth.admin.updateUserById(targetUserId, {
    app_metadata: { user_role: newRole }
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserStatus(targetUserId: string, newStatus: "pending" | "approved" | "rejected" | "suspended") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return { error: "Unauthorized" };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("profiles")
    .update({ status: newStatus })
    .eq("id", targetUserId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/pending");
  revalidatePath("/admin");
  return { success: true };
}

export async function getAdminStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return null;
  }

  // Use Admin Client to bypass RLS in case JWT role claim is stale
  const adminClient = createAdminClient();
  const { data: profiles } = await adminClient.from("profiles").select("status, role");

  const totalUsers = profiles?.length || 0;
  const pendingUsers = profiles?.filter((p) => p.status === "pending").length || 0;
  const approvedUsers = profiles?.filter((p) => p.status === "approved").length || 0;
  const adminUsers = profiles?.filter((p) => p.role === "admin" || p.role === "super_admin").length || 0;

  return {
    totalUsers,
    pendingUsers,
    approvedUsers,
    adminUsers,
  };
}

export async function createGlobalCategory(name: string, type: "income" | "expense", color?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("categories").insert({
    name,
    type,
    color: color || (type === "income" ? "#10b981" : "#f43f5e"),
    is_global: true,
    user_id: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/transactions");
  return { success: true };
}

export async function deleteGlobalCategory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/transactions");
  return { success: true };
}

export async function deleteUser(userId: string) {
  try {
    const adminClient = createAdminClient();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id === userId) return { error: 'Cannot delete yourself' };
    
    // Delete in correct order before auth deletion (manual cascade to prevent foreign key errors)
    await adminClient.from('audit_log').delete().eq('actor_id', userId);
    await adminClient.from('savings_contributions').delete().eq('user_id', userId);
    await adminClient.from('savings_accounts').delete().eq('user_id', userId);
    await adminClient.from('debt_payments').delete().eq('user_id', userId);
    await adminClient.from('debts').delete().eq('user_id', userId);
    await adminClient.from('wishlist').delete().eq('user_id', userId);
    await adminClient.from('transactions').delete().eq('user_id', userId);
    await adminClient.from('budgets').delete().eq('user_id', userId);
    await adminClient.from('feature_requests').delete().eq('user_id', userId);
    await adminClient.from('profiles').delete().eq('id', userId);

    // Attempt deletion
    const { error } = await adminClient.auth.admin.deleteUser(userId);
    if (error) {
      console.error("Supabase Admin Delete User Error:", error);
      return { error: error.message };
    }

    // Attempt audit log for the action itself (actor is the admin deleting the user)
    if (user) {
      await adminClient.from('audit_log').insert({
        actor_id: user.id,
        action: 'USER_DELETED',
        target_type: 'user',
        target_id: userId
      });
    }
    
    revalidatePath('/admin/users');
    revalidatePath('/admin/pending');
    
    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error in deleteUser:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
}
