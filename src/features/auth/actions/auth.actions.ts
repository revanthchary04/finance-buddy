"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/resend";
import { loginSchema, signupSchema } from "../schemas/auth.schema";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: result.error.issues[0]?.message || "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = signupSchema.safeParse({ fullName, email, password });
  if (!result.success) {
    return { error: result.error.issues[0]?.message || "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Send email notification to Admin about the new signup request
  try {
    await sendEmail({
      to: "admin@sriram.com",
      subject: "🔔 New Signup Request - Finance Buddy",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h2 style="color: #f59e0b; margin-top: 0;">New User Signup Request</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p>This user is awaiting your approval to access Finance Buddy.</p>
          <div style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/pending" style="display: inline-block; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Review & Approve Request
            </a>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.log("Failed to send admin notification email:", err);
  }

  redirect("/verify-email");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
