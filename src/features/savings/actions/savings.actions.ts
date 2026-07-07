"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSavings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("savings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching savings:", error);
    return [];
  }

  return data;
}

export async function createSavings(data: { name: string; target_amount: number; month: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("savings").insert({
    user_id: user.id,
    name: data.name,
    target_amount: data.target_amount,
    current_amount: 0,
    month: data.month,
  });

  if (error) return { error: error.message };

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function addContribution(id: string, amount: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Get current amount
  const { data: savingsItem, error: fetchError } = await supabase
    .from("savings")
    .select("current_amount")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !savingsItem) {
    return { error: "Failed to fetch savings item" };
  }

  const newAmount = Number(savingsItem.current_amount) + amount;

  const { error: updateError } = await supabase
    .from("savings")
    .update({ current_amount: newAmount })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) return { error: updateError.message };

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  return { success: true };
}
