"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addContribution, markAsPurchased } from "../actions/wishlist.actions";

export function WishlistClient({ items }: { items: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleContribute = (id: string, amount: number, closePopover: () => void) => {
    startTransition(async () => {
      try {
        await addContribution(id, amount);
        toast.success("Contribution added!");
        closePopover();
      } catch (error: any) {
        toast.error(error.message || "Failed to contribute");
      }
    });
  };

  const handleMarkPurchased = (id: string) => {
    startTransition(async () => {
      try {
        await markAsPurchased(id);
        toast.success("Goal marked as purchased!");
      } catch (error: any) {
        toast.error(error.message || "Failed to update goal");
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "funded": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "purchased": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "cancelled": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-xl font-bold">No goals yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You haven&apos;t set up any financial goals. Add one to start tracking your savings!
          </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const current = Number(item.current_amount) || 0;
        const target = Number(item.target_amount) || 0;
        const percent = Math.min((current / target) * 100, 100);
        
        return (
          <Card key={item.id} className="flex flex-col border-border/50 shadow-sm bg-card/60 backdrop-blur-xl hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={getPriorityColor(item.priority)}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </Badge>
                <Badge variant="outline" className={getStatusColor(item.status)}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
              </div>
              <CardTitle className="text-xl line-clamp-1">{item.name}</CardTitle>
              {item.description && (
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex-1 pb-3">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold tracking-tight">
                    ₹{current.toLocaleString("en-IN")}
                  </div>
                  <div className="text-sm text-muted-foreground pb-1">
                    of ₹{target.toLocaleString("en-IN")}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Progress value={percent} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percent.toFixed(0)}%</span>
                    {item.target_date && (
                      <span>Due: {format(new Date(item.target_date), "MMM d, yyyy")}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-3 border-t">
              {item.status === "active" && (
                <ContributePopover 
                  onContribute={(amt, close) => handleContribute(item.id, amt, close)}
                  isPending={isPending}
                />
              )}
              {item.status === "funded" && (
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => handleMarkPurchased(item.id)}
                  disabled={isPending}
                >
                  Mark as Purchased
                </Button>
              )}
              {(item.status === "purchased" || item.status === "cancelled") && (
                <Button variant="outline" className="w-full" disabled>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

function ContributePopover({ 
  onContribute, 
  isPending 
}: { 
  onContribute: (amt: number, close: () => void) => void;
  isPending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (num > 0) {
      onContribute(num, () => {
        setOpen(false);
        setAmount("");
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="default" className="w-full">
          Contribute
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add funds</h4>
            <p className="text-sm text-muted-foreground">
              Enter amount to contribute.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Button type="submit" disabled={isPending}>
              Add
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
