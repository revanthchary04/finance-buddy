"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const fullName = formData.get("full_name") as string;
  const phoneNumber = formData.get("phone_number") as string;
  const designation = formData.get("designation") as string;
  const company = formData.get("company") as string;
  const avatarFile = formData.get("avatar") as File | null;

  let avatarUrl = undefined;

  // Handle avatar upload if provided
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true });

    if (uploadError) {
      console.error("Avatar upload failed:", uploadError);
      return { error: "Failed to upload avatar" };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    avatarUrl = publicUrl;
  }

  // Update profile
  const updateData: any = {
    full_name: fullName,
    phone_number: phoneNumber,
    designation,
    company,
    onboarding_completed: true,
  };

  if (avatarUrl) {
    updateData.avatar_url = avatarUrl;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (updateError) {
    console.error("Profile update failed:", updateError);
    return { error: updateError.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
