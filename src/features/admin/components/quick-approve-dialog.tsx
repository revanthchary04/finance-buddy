"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { getPendingUsers, approveUser, rejectUser } from "../actions/admin.actions";
import { toast } from "sonner";
import { UserCheck, Check, X, Clock, UserPlus } from "lucide-react";

export function QuickApproveDialog() {
  const [open, setOpen] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchPending = async () => {
    const data = await getPendingUsers();
    setPendingUsers(data || []);
  };

  useEffect(() => {
    fetchPending();
  }, [open]);

  const supabase = createClient();

  const handleApprove = (userId: string) => {
    startTransition(async () => {
      const res = await approveUser(userId);
      if (res?.error) {
        toast.error(res.error);
      } else {
        await supabase.auth.refreshSession();
        toast.success("User request accepted!");
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
        toast.success("User request rejected");
        setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="w-full justify-start bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 gap-2 font-semibold shadow-xs"
        >
          <UserPlus className="h-4 w-4 shrink-0" />
          <span className="truncate">User Requests</span>
          <Badge className="ml-auto bg-amber-500 text-black font-bold text-[10px] px-1.5 py-0">
            {pendingUsers.length}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] border-border/60 bg-card/95 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-amber-500" /> Pending Signup Requests
          </DialogTitle>
          <DialogDescription>
            Accept or decline new user registration requests to grant platform access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 pt-2">
          {pendingUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50 hover:bg-background/80 transition-all"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-amber-500/20 bg-amber-500/10">
                  <AvatarFallback className="text-amber-500 text-xs font-bold">
                    {user.full_name?.substring(0, 2).toUpperCase() || user.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold leading-none">{user.full_name || "New Account"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="default"
                  disabled={isPending}
                  onClick={() => handleApprove(user.id)}
                  className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white gap-1 text-xs px-2.5"
                >
                  <Check className="h-3.5 w-3.5" /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => handleReject(user.id)}
                  className="h-8 gap-1 text-xs px-2.5"
                >
                  <X className="h-3.5 w-3.5" /> Decline
                </Button>
              </div>
            </div>
          ))}

          {pendingUsers.length === 0 && (
            <div className="text-center py-10 border border-dashed rounded-xl bg-background/30 text-muted-foreground">
              <Clock className="mx-auto h-8 w-8 text-amber-500/60 mb-2" />
              <p className="text-sm font-medium text-foreground">No pending user requests</p>
              <p className="text-xs text-muted-foreground mt-1">All signup requests have been reviewed.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
