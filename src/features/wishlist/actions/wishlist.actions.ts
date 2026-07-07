"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { type WishlistFormData } from "../schemas/wishlist.schema";

export async function getWishlistItems() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }

  return data;
}

export async function createWishlistItem(data: WishlistFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("wishlist")
    .insert({
      user_id: user.id,
      name: data.name,
      description: data.description || null,
      target_amount: data.target_amount,
      current_amount: 0,
      priority: data.priority,
      target_date: data.target_date || null,
      image_url: data.image_url || null,
      status: "active"
    });

  if (error) throw new Error(error.message);

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
}

export async function addContribution(id: string, amount: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // First fetch the current amount and target amount
  const { data: item, error: fetchError } = await supabase
    .from("wishlist")
    .select("current_amount, target_amount, status")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !item) throw new Error("Wishlist item not found");

  const newAmount = Number(item.current_amount) + amount;
  
  // Auto-set status to funded if amount is met
  let newStatus = item.status;
  if (newAmount >= Number(item.target_amount) && item.status === "active") {
    newStatus = "funded";
  }

  const { error } = await supabase
    .from("wishlist")
    .update({ 
      current_amount: newAmount,
      status: newStatus 
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
}

export async function markAsPurchased(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("wishlist")
    .update({ status: "purchased" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
}
