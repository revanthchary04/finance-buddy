import { getAuditLogs } from "@/features/admin/actions/logs.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AppLogsPage() {
  const rawLogs = await getAuditLogs();

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            App Logs
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Global authentication events and user activity across the application.
          </p>
        </div>
      </div>
      
      <div className="border border-border/50 shadow-xl rounded-xl overflow-hidden bg-card/60 backdrop-blur-xl">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Event</TableHead>
              <TableHead className="text-right">Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rawLogs.map((log: any) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.user_name}</TableCell>
                <TableCell className="text-muted-foreground">{log.user_email}</TableCell>
                <TableCell>
                  <Badge variant={log.action === "SIGNED_IN" ? "default" : "secondary"}>
                    {log.action === "SIGNED_IN" ? "Logged In" : log.action === "SIGNED_OUT" ? "Logged Out" : log.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {new Date(log.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
              </TableRow>
            ))}
            {rawLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No authentication logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
