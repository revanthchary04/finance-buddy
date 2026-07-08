"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getBankAccounts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bank accounts:", error);
    return [];
  }

  return data;
}

export async function saveBankAccount(id: string | null, formData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { bank_name, account_type, last_four_digits, current_balance, notes } = formData;

  if (id) {
    const { error } = await supabase
      .from("bank_accounts")
      .update({
        bank_name,
        account_type,
        last_four_digits: last_four_digits || null,
        current_balance: Number(current_balance),
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("bank_accounts")
      .insert({
        user_id: user.id,
        bank_name,
        account_type,
        last_four_digits: last_four_digits || null,
        current_balance: Number(current_balance),
        notes: notes || null
      });

    if (error) return { error: error.message };
  }

  revalidatePath("/savings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteBankAccount(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("bank_accounts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/savings");
  revalidatePath("/dashboard");
  return { success: true };
}
