"use client";

import { useState, useEffect, useTransition } from "react";
import { Bell, UserCheck, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getPendingUsers, approveUser, rejectUser } from "@/features/admin/actions/admin.actions";
import { toast } from "sonner";

export function AdminNotificationBell() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchPending = async (showToasts = false) => {
    const data = await getPendingUsers();

    if (!data) return;

    setPendingUsers((prev) => {
      if (showToasts && data.length > prev.length) {
        const newUsers = data.filter((d) => !prev.some((p) => p.id === d.id));
        newUsers.forEach((u) => {
          toast.info(`🔔 New Signup Request: ${u.full_name || u.email}`, {
            description: "Awaiting your admin approval.",
          });
        });
      }
      return data;
    });
  };

  useEffect(() => {
    // Initial fetch without toasts
    fetchPending(false);

    // Fast polling fallback every 5 seconds with toasts enabled
    const interval = setInterval(() => fetchPending(true), 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleApprove = (userId: string) => {
    startTransition(async () => {
      const res = await approveUser(userId);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("User approved!");
        setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    });
  };

  const handleReject = (userId: string) => {
    startTransition(async () => {
      const res = await rejectUser(userId);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("User request declined");
        setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          {pendingUsers.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] p-0 flex items-center justify-center font-bold animate-pulse">
              {pendingUsers.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0 border-border/60 bg-card/95 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-amber-500" />
            <h4 className="font-semibold text-sm">Signup Notifications</h4>
          </div>
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10 text-xs font-semibold">
            {pendingUsers.length} Pending
          </Badge>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2 space-y-2">
          {pendingUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-background/50 hover:bg-background/80 transition-all"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Avatar className="h-8 w-8 border border-amber-500/20 bg-amber-500/10 shrink-0">
                  <AvatarFallback className="text-amber-500 text-[10px] font-bold">
                    {user.full_name?.substring(0, 2).toUpperCase() || user.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold truncate leading-tight">{user.full_name || "New User"}</span>
                  <span className="text-[11px] text-muted-foreground truncate">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleApprove(user.id)}
                  className="h-7 px-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium gap-1"
                >
                  <Check className="h-3 w-3" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => handleReject(user.id)}
                  className="h-7 px-2 text-[11px] font-medium"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}

          {pendingUsers.length === 0 && (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No new user signup requests.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
