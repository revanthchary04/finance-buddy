"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bell, RefreshCw } from "lucide-react";
import { AdminNotificationBell } from "@/components/admin-notification-bell";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function Header({ isAdmin, warningCount = 0 }: { isAdmin: boolean, warningCount?: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-8 w-8 rounded-full"
          onClick={handleRefresh}
          disabled={isPending}
        >
          <RefreshCw className={`h-4 w-4 text-muted-foreground ${isPending ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh data</span>
        </Button>

        {isAdmin ? (
          <AdminNotificationBell />
        ) : (
          <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
            <Bell className="h-4 w-4 text-muted-foreground" />
            {warningCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {warningCount}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        )}
      </div>
    </header>
  );
}
