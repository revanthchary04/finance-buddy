"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig } from "@/config/navigation";
import { useAuth } from "@/providers/auth-provider";
import { getPendingUsers } from "@/features/admin/actions/admin.actions";
import { Badge } from "@/components/ui/badge";
import { QuickApproveDialog } from "@/features/admin/components/quick-approve-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { Wallet, User } from "lucide-react";

export function AppSidebar({
  initialProfile,
  ...props
}: {
  initialProfile?: any;
} & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { profile: clientProfile } = useAuth();

  const profile = clientProfile || initialProfile;
  const role = profile?.role === "admin" || profile?.role === "super_admin" ? "admin" : "user";
  const navItems = navigationConfig[role] || navigationConfig.user;

  const [pendingCount, setPendingCount] = React.useState<number>(0);

  // Split into user items and admin items if admin
  const mainItems = navItems.filter((item) => !item.href.startsWith("/admin"));
  const adminItems = navItems.filter((item) => item.href.startsWith("/admin"));

  React.useEffect(() => {
    if (role === "admin") {
      const fetchPendingCount = async () => {
        const data = await getPendingUsers();
        setPendingCount(data?.length || 0);
      };
      fetchPendingCount();
    }
  }, [role, pathname]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Wallet className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Finance Buddy</span>
                  <span className="text-xs text-muted-foreground">Premium Edition</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {adminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                        {item.href === "/admin/pending" && pendingCount > 0 && (
                          <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[10px] px-1.5 py-0.2 ml-auto">
                            {pendingCount}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="pb-4">
        <NavUser />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="mb-1 text-muted-foreground hover:text-foreground">
              <Link href="/settings">
                <User className="size-4" />
                <span>Profile Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action={async () => {
              const { signOut } = await import("@/features/auth/actions/auth.actions");
              await signOut();
            }}>
              <SidebarMenuButton 
                type="submit"
                className="mt-2 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 font-medium"
              >
                <Wallet className="size-4 rotate-180 opacity-0 hidden" />
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
                  Log out
                </span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
