import { getAdminStats, getPendingUsers } from "@/features/admin/actions/admin.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, CheckCircle2, ShieldAlert, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCheckComponent } from "@/features/admin/components/user-check-component";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();
  const pendingUsers = await getPendingUsers();

  return (
    <div className="flex-1 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Admin Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            System health, user requests, and platform access control.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="default" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/20">
            <Link href="/admin/pending">
              <UserCheck className="mr-2 h-4 w-4" /> Review Pending ({stats?.pendingUsers || 0})
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-b from-card to-card/50 backdrop-blur-xl shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-b from-card to-card/50 backdrop-blur-xl shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{stats?.pendingUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires admin action</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-b from-card to-card/50 backdrop-blur-xl shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Members</CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">{stats?.approvedUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Approved & active</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-b from-card to-card/50 backdrop-blur-xl shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Administrators</CardTitle>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{stats?.adminUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Elevated privileges</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Pending Section */}
      <Card className="border-border/50 shadow-lg bg-card/60 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Recent Pending Requests</CardTitle>
            <CardDescription className="mt-1">
              New users waiting for your decision to access Finance Buddy.
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
            <Link href="/admin/pending">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingUsers.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/50 hover:bg-background/80 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-primary/20 bg-primary/10">
                    <AvatarFallback className="text-primary font-semibold">
                      {user.full_name?.substring(0, 2).toUpperCase() || user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold leading-none">{user.full_name || "New User"}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                  </div>
                </div>
                <UserCheckComponent userId={user.id} />
              </div>
            ))}

            {pendingUsers.length === 0 && (
              <div className="text-center py-10 border border-dashed rounded-xl bg-background/30">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2 opacity-80" />
                <p className="text-sm font-medium text-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No pending user approval requests.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
