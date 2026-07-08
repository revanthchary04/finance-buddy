"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RefreshCw, GripHorizontal, Check } from "lucide-react";
import { AdminNotificationBell } from "@/components/admin-notification-bell";
import { NotificationBell } from "@/components/notification-bell";
import { useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export function Header({ isAdmin, warningCount = 0 }: { isAdmin: boolean, warningCount?: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isArrangeMode, setIsArrangeMode] = useState(false);

  // Listen for arrange mode being toggled from elsewhere if needed
  useEffect(() => {
    const handleToggle = (e: any) => {
      if (e.detail !== undefined) {
        setIsArrangeMode(e.detail);
      }
    };
    window.addEventListener("syncArrangeMode", handleToggle);
    return () => window.removeEventListener("syncArrangeMode", handleToggle);
  }, []);

  // Dispatch refresh state for skeletons and show toast when done
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("refreshStateChange", { detail: isPending }));
    
    // If it just finished refreshing (was pending, now is not)
    if (!isPending) {
      const hasJustRefreshed = sessionStorage.getItem("justRefreshed");
      if (hasJustRefreshed === "true") {
        import("sonner").then(({ toast }) => {
          toast.success("Refreshed just now", { position: "top-center" });
        });
        sessionStorage.removeItem("justRefreshed");
      }
    }
  }, [isPending]);

  const toggleArrangeMode = () => {
    const newMode = !isArrangeMode;
    setIsArrangeMode(newMode);
    window.dispatchEvent(new CustomEvent("toggleArrangeMode", { detail: newMode }));
  };

  const handleRefresh = () => {
    sessionStorage.setItem("justRefreshed", "true");
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
          className={`relative h-8 w-8 rounded-full ${isArrangeMode ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : ''}`}
          onClick={toggleArrangeMode}
        >
          {isArrangeMode ? (
            <Check className="h-4 w-4" />
          ) : (
            <GripHorizontal className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="sr-only">Toggle arrange mode</span>
        </Button>

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
          <NotificationBell />
        )}
      </div>
    </header>
  );
}
