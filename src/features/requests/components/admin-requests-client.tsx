"use client";

import { useTransition } from "react";
import { updateFeatureRequestStatus } from "../actions/requests.actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
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

export function AdminFeatureRequestsClient({ initialRequests }: { initialRequests: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, status: string) => {
    startTransition(async () => {
      const res = await updateFeatureRequestStatus(id, status);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Request marked as ${status}`);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-muted-foreground"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
      case "in_review":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"><Clock className="mr-1 h-3 w-3 animate-pulse" /> In Review</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"><CheckCircle2 className="mr-1 h-3 w-3" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card/40 backdrop-blur-xl">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="w-[150px]">User Name</TableHead>
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            <TableHead>Reference Links</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                No feature requests to review.
              </TableCell>
            </TableRow>
          ) : (
            initialRequests.map((req) => (
              <TableRow key={req.id} className="hover:bg-muted/30 border-border/40 transition-colors">
                <TableCell className="font-medium">
                  {req.profiles?.full_name || req.profiles?.email || "Unknown"}
                </TableCell>
                <TableCell className="font-semibold">
                  {req.request_type === 'bug' ? (
                    <Badge variant="outline" className="text-rose-500 border-rose-500/30 bg-rose-500/10 mb-1 mr-2 px-1 py-0 text-[10px]">Bug</Badge>
                  ) : (
                    <Badge variant="outline" className="text-purple-500 border-purple-500/30 bg-purple-500/10 mb-1 mr-2 px-1 py-0 text-[10px]">Feature</Badge>
                  )}
                  {req.title}
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground line-clamp-3" title={req.description}>
                    {req.description}
                  </p>
                </TableCell>
                <TableCell>
                  {req.reference_links && req.reference_links.length > 0 ? (
                    <ul className="text-xs space-y-1">
                      {req.reference_links.map((link: string, i: number) => (
                        <li key={i} className="truncate max-w-[150px]" title={link}>
                          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            Link {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground text-xs">None</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(req.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(req.status)}
                    <Select
                      defaultValue={req.status}
                      disabled={isPending}
                      onValueChange={(val) => handleStatusChange(req.id, val)}
                    >
                      <SelectTrigger className="h-8 text-xs bg-background/60 border-border/50 w-[110px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_review">In Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
