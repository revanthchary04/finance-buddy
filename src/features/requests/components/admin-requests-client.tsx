"use client";

import { useState, useTransition } from "react";
import { updateFeatureRequestStatus, addFeatureRequestComment } from "../actions/requests.actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, Search, SearchCheck, Loader2, Sparkles, MessageSquarePlus, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [openCommentDialog, setOpenCommentDialog] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const handleAddComment = (reqId: string) => {
    if (!commentText.trim()) return;
    
    startTransition(async () => {
      const res = await addFeatureRequestComment(reqId, commentText);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Comment added successfully!");
        setCommentText("");
        setOpenCommentDialog(null);
      }
    });
  };

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
      case "under_review":
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"><Search className="mr-1 h-3 w-3" /> Under Review</Badge>;
      case "accepted":
        return <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20"><SearchCheck className="mr-1 h-3 w-3" /> Accepted</Badge>;
      case "in_progress":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"><Loader2 className="mr-1 h-3 w-3 animate-spin" /> In Progress</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-500/10 text-red-500 hover:bg-red-500/20"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"><Sparkles className="mr-1 h-3 w-3" /> Completed</Badge>;
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
                <TableCell className="max-w-[300px] break-words whitespace-normal align-top">
                  <p className="text-sm text-muted-foreground" title={req.description}>
                    {req.description}
                  </p>
                  
                  {req.feature_request_comments && req.feature_request_comments.length > 0 && (
                    <div className="mt-4 space-y-2 border-t pt-3 border-border/50">
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><MessageSquare className="h-3 w-3" /> Admin Comments ({req.feature_request_comments.length})</p>
                      {req.feature_request_comments.map((comment: any) => (
                        <div key={comment.id} className="bg-muted/40 rounded p-2 text-xs">
                          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                            <span className="font-medium text-primary">{comment.profiles?.full_name || 'Admin'}</span>
                            <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                          </div>
                          <p className="text-muted-foreground whitespace-pre-wrap">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3">
                    <Dialog open={openCommentDialog === req.id} onOpenChange={(open) => {
                      if (open) setOpenCommentDialog(req.id);
                      else { setOpenCommentDialog(null); setCommentText(""); }
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <MessageSquarePlus className="mr-2 h-3 w-3" /> Add Comment
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Admin Comment</DialogTitle>
                          <DialogDescription>
                            This comment will be visible to the user who requested the feature.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <Textarea 
                            placeholder="Enter your comment here..." 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setOpenCommentDialog(null)}>Cancel</Button>
                            <Button onClick={() => handleAddComment(req.id)} disabled={isPending || !commentText.trim()}>
                              {isPending ? "Adding..." : "Add Comment"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
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
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
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
