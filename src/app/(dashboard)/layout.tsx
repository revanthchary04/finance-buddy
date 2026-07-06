import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/layouts/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AdminNotificationBell } from "@/components/admin-notification-bell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

  return (
    <SidebarProvider>
      <AppSidebar initialProfile={profile} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          {isAdmin && (
            <div className="flex items-center gap-3">
              <AdminNotificationBell />
            </div>
          )}
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
