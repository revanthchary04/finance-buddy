"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { transactionSchema } from "../schemas/transaction.schema";

export async function getTransactions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, icon, color)")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return data;
}

export async function getCategories() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .or(`is_global.eq.true,user_id.eq.${user.id}`)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
}

export async function createTransaction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const result = transactionSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0]?.message || "Invalid transaction data" };
  }

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    amount: result.data.amount,
    type: result.data.type,
    category_id: result.data.category_id,
    date: typeof result.data.date === "string" ? result.data.date : result.data.date.toISOString().split("T")[0],
    description: result.data.description,
    location: result.data.location,
    notes: result.data.notes,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/reports");
  
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/reports");
  
  return { success: true };
}
