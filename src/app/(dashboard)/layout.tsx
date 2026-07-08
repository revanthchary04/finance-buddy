import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/layouts/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Header } from "@/layouts/header";
import { getDashboardStats } from "@/features/dashboard/actions/dashboard.actions";
import { calculateBudgetWarnings } from "@/features/warnings/utils/financial-warnings";
import { getBudgets } from "@/features/budgets/actions/budget.actions";

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

  const stats = await getDashboardStats();
  const budgets = await getBudgets();
  const warningState = calculateBudgetWarnings(budgets, stats);
  const warningCount = warningState.warnings.length + (warningState.fallbackWarning ? 1 : 0);

  return (
    <SidebarProvider>
      <AppSidebar initialProfile={profile} initialUser={user} />
      <SidebarInset>
        <Header isAdmin={isAdmin} warningCount={warningCount} />
        <div className="flex flex-1 flex-col gap-4 px-4 sm:px-6 lg:px-8 pt-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
