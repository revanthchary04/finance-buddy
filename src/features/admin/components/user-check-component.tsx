"use client";

import { useTransition } from "react";
import { approveUser, rejectUser } from "../actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export function UserCheckComponent({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveUser(userId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("User approved successfully");
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectUser(userId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("User rejected successfully");
      }
    });
  };

  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        variant="default" 
        className="bg-emerald-500 hover:bg-emerald-600"
        onClick={handleApprove}
        disabled={isPending}
      >
        <Check className="mr-1 h-4 w-4" /> Approve
      </Button>
      <Button 
        size="sm" 
        variant="destructive"
        onClick={handleReject}
        disabled={isPending}
      >
        <X className="mr-1 h-4 w-4" /> Reject
      </Button>
    </div>
  );
}
