"use client";

import { useState, useTransition, useEffect } from "react";
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
import { createTransaction, updateTransaction } from "../actions/transaction.actions";
import { toast } from "sonner";
import { Plus, ArrowUpRight, ArrowDownRight, IndianRupee, AlertCircle, AlertTriangle, Building2 } from "lucide-react";
import { getFinancialSnapshot } from "@/features/warnings/actions/warnings.actions";
import { calculateBudgetWarnings, WarningLevel } from "@/features/warnings/utils/financial-warnings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Category {
  id: string;
  name: string;
  type: string;
}

export function AddTransactionDialog({ categories, editData, trigger }: { categories: Category[], editData?: any, trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [type, setType] = useState<"income" | "expense" | "asset">("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [snapshot, setSnapshot] = useState<any>(null);

  useEffect(() => {
    if (open && !snapshot) {
      getFinancialSnapshot().then(setSnapshot);
    }
  }, [open, snapshot]);

  useEffect(() => {
    if (open && editData) {
      setType(editData.type || "expense");
      setAmount(editData.amount?.toString() || "");
      setCategoryId(editData.category_id || "");
      setDescription(editData.description || "");
      setLocation(editData.location || "");
      setDate(editData.date ? new Date(editData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    }
  }, [open, editData]);

  const filteredCategories = categories.filter((c) => c.type === type);

  // Calculate pre-transaction warning
  let warning: { level: WarningLevel, message: string, description: string } | null = null;
  if (type === "expense" && amount && snapshot) {
    const projectedStats = {
      ...snapshot,
      monthly_expenses: snapshot.monthly_expenses + Number(amount),
      lifetime_savings: snapshot.lifetime_savings - Number(amount)
    };
    const projectedWarningState = calculateBudgetWarnings([], projectedStats);
    if (projectedWarningState.fallbackWarning?.level) {
      warning = projectedWarningState.fallbackWarning;
    }
  }

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

    startTransition(async () => {
      const payload = {
        amount: Number(amount),
        type,
        category_id: categoryId,
        description,
        location,
        date,
      };

      const res = editData 
        ? await updateTransaction(editData.id, payload)
        : await createTransaction(payload);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(editData ? "Transaction updated successfully" : "Transaction recorded successfully!");
        setOpen(false);
        if (!editData) {
          setAmount("");
          setDescription("");
          setLocation("");
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium shadow-lg shadow-emerald-950/20">
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-border/60 bg-card/95 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-emerald-500" /> {editData ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
          <DialogDescription>
            {editData ? "Update your transaction details." : "Log income or expense details to keep your financial metrics accurate."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Type Toggle */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-muted/60 rounded-xl border border-border/40">
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
            <button
              type="button"
              onClick={() => setType("asset")}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                type === "asset"
                  ? "bg-blue-500/15 text-blue-500 border border-blue-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="h-4 w-4" /> Asset
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs font-medium">Amount (₹) <span className="text-red-500">*</span></Label>
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

          {warning && (
            <Alert className={warning.level === "critical" ? "border-red-500/50 bg-red-500/10 text-red-500" : warning.level === "warning" ? "border-orange-500/50 bg-orange-500/10 text-orange-500" : "border-yellow-500/50 bg-yellow-500/10 text-yellow-500"}>
              {warning.level === "critical" ? <AlertCircle className="h-4 w-4 text-red-500" /> : <AlertTriangle className="h-4 w-4 text-orange-500" />}
              <AlertTitle>Financial Risk Warning</AlertTitle>
              <AlertDescription className="text-foreground">
                This expense will trigger a {warning.level} warning: <strong>{warning.message}</strong>. {warning.description} Are you sure you want to proceed?
              </AlertDescription>
            </Alert>
          )}

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
            <Label htmlFor="description" className="text-xs font-medium">Description <span className="text-red-500">*</span></Label>
            <Input
              id="description"
              placeholder="e.g. Grocery shopping, Salary payout"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-xs font-medium">Location <span className="text-muted-foreground font-normal">(Optional)</span></Label>
            <Input
              id="location"
              placeholder="e.g. New York, Online"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-background/50"
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs font-medium">Date <span className="text-red-500">*</span></Label>
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
                  : type === "expense"
                  ? "bg-rose-600 hover:bg-rose-500 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }
            >
              {isPending ? "Saving..." : editData ? "Save Changes" : `Record ${type === "income" ? "Income" : type === "expense" ? "Expense" : "Asset"}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
