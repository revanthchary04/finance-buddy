"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig } from "@/config/navigation";
import { useAuth } from "@/providers/auth-provider";
import { getPendingUsers } from "@/features/admin/actions/admin.actions";
import { Badge } from "@/components/ui/badge";
import { QuickApproveDialog } from "@/features/admin/components/quick-approve-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
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
import { Wallet, Sparkles } from "lucide-react";

export function AppSidebar({
  initialProfile,
  initialUser,
  ...props
}: {
  initialProfile?: any;
  initialUser?: any;
} & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { profile: clientProfile, user: clientUser } = useAuth();

  const profile = initialProfile || clientProfile;
  const user = initialUser || clientUser;
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

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/feature-requests"}>
                  <Link href="/feature-requests">
                    <Sparkles />
                    <span>Feature Requests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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

      <SidebarFooter className="mt-auto shrink-0 border-t p-3 space-y-2 overflow-hidden">
        <div className="flex items-center justify-between px-2 py-1 group-data-[collapsible=icon]:justify-center">
          <span className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">Theme</span>
          <ThemeToggle />
        </div>
        <NavUser user={clientUser || initialUser} profile={profile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
