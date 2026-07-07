"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquarePlus, Clock, CheckCircle2, XCircle } from "lucide-react";
import { createFeatureRequest } from "../actions/requests.actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function UserFeatureRequestsClient({ initialRequests }: { initialRequests: any[] }) {
  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState("feature");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [referenceLinks, setReferenceLinks] = useState<string[]>([""]);
  const [isPending, startTransition] = useTransition();

  const handleAddLink = () => setReferenceLinks([...referenceLinks, ""]);
  const handleUpdateLink = (index: number, value: string) => {
    const newLinks = [...referenceLinks];
    newLinks[index] = value;
    setReferenceLinks(newLinks);
  };
  const handleRemoveLink = (index: number) => {
    setReferenceLinks(referenceLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const cleanLinks = referenceLinks.filter(l => l.trim() !== "");

    startTransition(async () => {
      const res = await createFeatureRequest({ title, description, reference_links: cleanLinks, request_type: requestType });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Feature request submitted!");
        setOpen(false);
        setTitle("");
        setDescription("");
        setRequestType("feature");
        setReferenceLinks([""]);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-muted-foreground"><Clock className="mr-1 h-3 w-3" /> Sent</Badge>;
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Suggest features and improvements for Finance Buddy.</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Propose Feature
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquarePlus className="h-5 w-5 text-primary" />
                Submit a Feature Request
              </DialogTitle>
              <DialogDescription>
                What would you like to see next?
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Feature Title <span className="text-rose-500">*</span></Label>
                <Input
                  id="title"
                  placeholder="e.g. Export to PDF"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description <span className="text-rose-500">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="How would this feature work?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Reference Links (Optional)</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={handleAddLink} className="h-6 text-xs px-2">
                    <Plus className="h-3 w-3 mr-1" /> Add URL
                  </Button>
                </div>
                <div className="space-y-2">
                  {referenceLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="https://example.com"
                        value={link}
                        onChange={(e) => handleUpdateLink(index, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-rose-500"
                        onClick={() => handleRemoveLink(index)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
        {initialRequests.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground border rounded-xl border-dashed">
            No feature requests yet. Be the first to suggest one!
          </div>
        ) : (
          initialRequests.map((req) => (
            <Card key={req.id} className="relative overflow-hidden group flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    {req.request_type === 'bug' ? (
                      <Badge variant="outline" className="text-rose-500 border-rose-500/30 bg-rose-500/10 mb-2">Bug</Badge>
                    ) : (
                      <Badge variant="outline" className="text-purple-500 border-purple-500/30 bg-purple-500/10 mb-2">Feature</Badge>
                    )}
                    <CardTitle className="text-base font-semibold leading-tight">{req.title}</CardTitle>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
                <CardDescription className="text-xs">
                  {new Date(req.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {req.description}
                </p>
                {req.reference_links && req.reference_links.length > 0 && (
                  <div className="mt-auto pt-4 border-t space-y-1.5">
                    <p className="text-xs font-semibold text-foreground">Reference Links:</p>
                    <ul className="text-xs space-y-1">
                      {req.reference_links.map((link: string, i: number) => (
                        <li key={i} className="truncate">
                          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
