"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBudget } from "../actions/budget.actions";
import { toast } from "sonner";
import { Plus, PiggyBank } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export function AddBudgetDialog({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a budget name");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    startTransition(async () => {
      const res = await createBudget({
        name,
        amount: Number(amount),
        category_id: categoryId || undefined,
        period,
        start_date: startDate,
        end_date: endDate,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Budget goal created!");
        setOpen(false);
        setName("");
        setAmount("");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-950/20">
          <Plus className="mr-2 h-4 w-4" /> Create Budget Limit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-border/60 bg-card/95 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-blue-500" /> Set Spending Limit
          </DialogTitle>
          <DialogDescription>
            Define a monthly or category budget limit to track your spending.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Budget Name */}
          <div className="space-y-1.5">
            <Label htmlFor="b-name" className="text-xs font-medium">Budget Target Name</Label>
            <Input
              id="b-name"
              placeholder="e.g. Dining & Restaurants, Monthly Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50"
              required
            />
          </div>

          {/* Limit Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="b-amount" className="text-xs font-medium">Limit Amount (₹)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">₹</span>
              <Input
                id="b-amount"
                type="number"
                step="0.01"
                placeholder="10,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 bg-background/50 text-base font-semibold"
                required
              />
            </div>
          </div>

          {/* Optional Category */}
          <div className="space-y-1.5">
            <Label htmlFor="b-category" className="text-xs font-medium">Category (Optional)</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="All Categories (Global Budget)" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Period */}
          <div className="space-y-1.5">
            <Label htmlFor="b-period" className="text-xs font-medium">Budget Cycle</Label>
            <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="s-date" className="text-xs font-medium">Start Date</Label>
              <Input
                id="s-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-date" className="text-xs font-medium">End Date</Label>
              <Input
                id="e-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-500 text-white">
              {isPending ? "Creating..." : "Save Budget"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
