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
import { createTransaction } from "../actions/transaction.actions";
import { toast } from "sonner";
import { Plus, ArrowUpRight, ArrowDownRight, IndianRupee } from "lucide-react";

interface Category {
  id: string;
  name: string;
  type: string;
}

export function AddTransactionDialog({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!location.trim()) {
      toast.error("Please enter a location");
      return;
    }

    if (!notes.trim()) {
      toast.error("Please enter notes");
      return;
    }

    startTransition(async () => {
      const res = await createTransaction({
        amount: Number(amount),
        type,
        category_id: categoryId,
        description,
        location,
        notes,
        date,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Transaction recorded successfully!");
        setOpen(false);
        setAmount("");
        setDescription("");
        setLocation("");
        setNotes("");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium shadow-lg shadow-emerald-950/20">
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-border/60 bg-card/95 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-emerald-500" /> Record Transaction
          </DialogTitle>
          <DialogDescription>
            Log income or expense details to keep your financial metrics accurate.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted/60 rounded-xl border border-border/40">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                type === "expense"
                  ? "bg-rose-500/15 text-rose-500 border border-rose-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowDownRight className="h-4 w-4" /> Expense
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                type === "income"
                  ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowUpRight className="h-4 w-4" /> Income
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs font-medium">Amount (₹)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">₹</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 bg-background/50 text-base font-semibold"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-xs font-medium">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-medium">Description</Label>
            <Input
              id="description"
              placeholder="e.g. Grocery shopping, Salary payout"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-xs font-medium">Location</Label>
            <Input
              id="location"
              placeholder="e.g. New York, Online"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-background/50"
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-medium">Notes</Label>
            <Input
              id="notes"
              placeholder="Additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-background/50"
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs font-medium">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-background/50"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={
                type === "income"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-rose-600 hover:bg-rose-500 text-white"
              }
            >
              {isPending ? "Saving..." : `Record ${type === "income" ? "Income" : "Expense"}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
