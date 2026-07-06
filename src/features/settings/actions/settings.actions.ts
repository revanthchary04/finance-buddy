"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  full_name: string;
  phone_number: string;
  designation?: string;
  company?: string;
  currency?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      phone_number: data.phone_number,
      designation: data.designation || null,
      company: data.company || null,
      currency: data.currency || "INR",
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/", "layout");

  return { success: true };
}
