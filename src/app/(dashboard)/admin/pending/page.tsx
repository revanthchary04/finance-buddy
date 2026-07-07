import { getPendingUsers } from "@/features/admin/actions/admin.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheckComponent } from "@/features/admin/components/user-check-component";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, UserCheck } from "lucide-react";

export default async function PendingApprovalsPage() {
  const pendingUsers = await getPendingUsers();

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Pending Approvals
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review and approve pending user signups to grant them access to Finance Buddy.
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-amber-500/30 text-amber-500 bg-amber-500/10 gap-1.5 py-1.5 px-3">
          <Clock className="w-4 h-4" /> {pendingUsers.length} Requests Awaiting
        </Badge>
      </div>
      
      {/* Pending List Card */}
      <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Registration Requests</CardTitle>
          <CardDescription>
            Approved users will receive an automated email confirmation permitting them to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/40 bg-background/50 hover:bg-background/80 transition-all gap-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-amber-500/20 bg-amber-500/10">
                    <AvatarFallback className="text-amber-500 font-bold">
                      {user.full_name?.substring(0, 2).toUpperCase() || user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold leading-none">{user.full_name || "New Account"}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      Requested on {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <UserCheckComponent userId={user.id} />
                </div>
              </div>
            ))}

            {pendingUsers.length === 0 && (
              <div className="text-center py-16 border border-dashed rounded-xl bg-background/30">
                <UserCheck className="mx-auto h-10 w-10 text-emerald-500 mb-3 opacity-80" />
                <h3 className="text-base font-semibold">No Pending Approvals</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  All user requests have been reviewed and processed!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
