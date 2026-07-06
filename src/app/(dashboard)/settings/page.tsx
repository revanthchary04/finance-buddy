import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/features/settings/components/settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="pb-2 border-b">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Account Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your profile, system preferences, and security permissions.
        </p>
      </div>

      {/* Settings Form */}
      <SettingsForm profile={profile} />
    </div>
  );
}
