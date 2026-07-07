"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceStrict } from "date-fns";

type RawLog = {
  id: string;
  action: string;
  created_at: string;
  actor_id: string;
  user_name: string;
  user_email: string;
  user_role: string;
};

type Session = {
  id: string;
  user_name: string;
  user_email: string;
  user_role: string;
  login_time: string;
  logout_time: string | null;
  duration: string;
  status: "Active" | "Logged Out";
};

function formatDuration(start: string, end: string) {
  return formatDistanceStrict(new Date(start), new Date(end));
}

export function LogsClient({ initialLogs }: { initialLogs: RawLog[] }) {
  const [roleFilter, setRoleFilter] = React.useState("all");

  const sessions = React.useMemo(() => {
    // 1. Sort logs chronologically (oldest first) to process in order
    const sortedLogs = [...initialLogs].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // 2. Group by user
    const logsByUser = sortedLogs.reduce((acc, log) => {
      if (!acc[log.actor_id]) acc[log.actor_id] = [];
      acc[log.actor_id].push(log);
      return acc;
    }, {} as Record<string, RawLog[]>);

    const allSessions: Session[] = [];

    // 3. Process sessions per user
    Object.values(logsByUser).forEach((userLogs) => {
      let currentSession: RawLog | null = null;

      userLogs.forEach((log) => {
        if (log.action === "SIGNED_IN") {
          // If a user has a SIGNED_IN event but already has an active session without a SIGNED_OUT,
          // treat the previous SIGNED_IN as its own session (Active) and start a new one.
          if (currentSession) {
            allSessions.push({
              id: currentSession.id,
              user_name: currentSession.user_name,
              user_email: currentSession.user_email,
              user_role: currentSession.user_role,
              login_time: currentSession.created_at,
              logout_time: null,
              duration: "Active",
              status: "Active",
            });
          }
          currentSession = log;
        } else if (log.action === "SIGNED_OUT") {
          // Close the current session if it exists
          if (currentSession) {
            allSessions.push({
              id: currentSession.id,
              user_name: currentSession.user_name,
              user_email: currentSession.user_email,
              user_role: currentSession.user_role,
              login_time: currentSession.created_at,
              logout_time: log.created_at,
              duration: formatDuration(currentSession.created_at, log.created_at),
              status: "Logged Out",
            });
            currentSession = null;
          }
        }
      });

      // If the user's last event was SIGNED_IN, they are still active
      if (currentSession) {
        const session = currentSession as RawLog;
        allSessions.push({
          id: session.id,
          user_name: session.user_name,
          user_email: session.user_email,
          user_role: session.user_role,
          login_time: session.created_at,
          logout_time: null,
          duration: "Active",
          status: "Active",
        });
      }
    });

    // 4. Sort sessions by login time descending (newest first)
    return allSessions.sort(
      (a, b) => new Date(b.login_time).getTime() - new Date(a.login_time).getTime()
    );
  }, [initialLogs]);

  // 5. Filter sessions based on selected role
  const filteredSessions = React.useMemo(() => {
    if (roleFilter === "all") return sessions;
    return sessions.filter((session) => session.user_role === roleFilter);
  }, [sessions, roleFilter]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="super_admin">Super Admin only</SelectItem>
            <SelectItem value="admin">Admin only</SelectItem>
            <SelectItem value="user">Users only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-border/50 shadow-xl rounded-xl overflow-hidden bg-card/60 backdrop-blur-xl">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Login Time</TableHead>
              <TableHead>Logout Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Event</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">{session.user_name}</TableCell>
                <TableCell className="text-muted-foreground">{session.user_email}</TableCell>
                <TableCell>
                  {new Date(session.login_time).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell>
                  {session.logout_time
                    ? new Date(session.logout_time).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">{session.duration}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={session.status === "Active" ? "default" : "secondary"}
                    className={
                      session.status === "Active"
                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                        : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    }
                  >
                    {session.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {filteredSessions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No sessions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
