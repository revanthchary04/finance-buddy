"use client";

import { useState, useTransition, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateUserRole, updateUserStatus } from "../actions/admin.actions";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Search, Shield, ShieldAlert, User as UserIcon, CheckCircle2, XCircle, Clock, Ban } from "lucide-react";
import { UserRowActions } from "./user-row-actions";
import { useAuth } from "@/providers/auth-provider";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  status: "pending" | "approved" | "rejected" | "suspended";
  created_at: string;
  last_accessed_at?: string | null;
}

function formatRelativeTime(dateString?: string | null) {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 30) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}

function formatDateJoined(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function UserManagementTable({ users }: { users: UserProfile[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const supabase = createClient();

  const handleRoleChange = (userId: string, newRole: "user" | "admin" | "super_admin") => {
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (res.error) {
        toast.error(res.error);
      } else {
        await supabase.auth.refreshSession();
        toast.success("Role updated successfully");
      }
    });
  };

  const handleStatusChange = (userId: string, newStatus: "pending" | "approved" | "rejected" | "suspended") => {
    startTransition(async () => {
      const res = await updateUserStatus(userId, newStatus);
      if (res.error) {
        toast.error(res.error);
      } else {
        if (newStatus === "approved") {
          await supabase.auth.refreshSession();
        }
        toast.success(`Account status updated to ${newStatus}`);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 gap-1.5 py-1 px-2.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 gap-1.5 py-1 px-2.5 font-medium">
            <Clock className="w-3.5 h-3.5" /> Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20 gap-1.5 py-1 px-2.5 font-medium">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/20 gap-1.5 py-1 px-2.5 font-medium">
            <Ban className="w-3.5 h-3.5" /> Suspended
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/5 gap-1">
            <ShieldAlert className="w-3 h-3 text-purple-400" /> Super Admin
          </Badge>
        );
      case "admin":
        return (
          <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5 gap-1">
            <Shield className="w-3 h-3 text-blue-400" /> Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-border/60 text-muted-foreground gap-1">
            <UserIcon className="w-3 h-3" /> Member
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background/50 border-border/60 focus:bg-background transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden bg-card/40 backdrop-blur-xl">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[300px]">User Account</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Access Status</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30 border-border/40 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border/60 bg-muted">
                      <AvatarFallback className="text-xs font-bold">
                        {user.full_name?.substring(0, 2).toUpperCase() || user.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm leading-tight text-foreground">
                        {user.full_name || "User Account"}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(user.role)}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDateJoined(user.created_at)}</TableCell>
                <TableCell className="text-muted-foreground">{formatRelativeTime(user.last_accessed_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Select
                      defaultValue={user.role}
                      onValueChange={(val) => handleRoleChange(user.id, val as any)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs bg-background/60 border-border/50">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      defaultValue={user.status}
                      onValueChange={(val) => handleStatusChange(user.id, val as any)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs bg-background/60 border-border/50">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approve</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Reject</SelectItem>
                        <SelectItem value="suspended">Suspend</SelectItem>
                      </SelectContent>
                    </Select>

                    {mounted && currentUser && (
                      <UserRowActions userId={user.id} currentUserId={currentUser.id} userFullName={user.full_name || "Unknown"} />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No users match your filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
