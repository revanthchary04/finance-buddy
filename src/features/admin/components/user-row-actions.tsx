"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteUser } from "../actions/admin.actions";
import { toast } from "sonner";

export function UserRowActions({ 
  userId, 
  currentUserId,
  userFullName
}: { 
  userId: string;
  currentUserId: string;
  userFullName: string;
}) {
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, startTransition] = useTransition();
  const router = useRouter();

  const isSelf = userId === currentUserId;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await deleteUser(userId);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("User deleted successfully");
          setDeleteInput("");
          setIsDeleteDialogOpen(false);
          router.refresh();
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to delete user");
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!isSelf && (
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 focus:bg-red-100 cursor-pointer"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setDeleteInput("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone. All data including 
              transactions, budgets, debts, savings, and wishlist will be permanently deleted.
              <br /><br />
              Type <strong className="text-foreground">{userFullName}</strong> to confirm deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder={`Type "${userFullName}" to confirm`}
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            className="mt-2"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteInput("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteInput !== userFullName || isDeleting}
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive"
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
