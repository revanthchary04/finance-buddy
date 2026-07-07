"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createDebt } from "../actions/debt.actions";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddDebtDialog() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("loan");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [tenure, setTenure] = useState("");
  const [minDue, setMinDue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !startDate) {
      toast.error("Please fill in required fields");
      return;
    }

    startTransition(async () => {
      const formData = {
        type,
        name,
        principal_amount: parseFloat(amount),
        interest_rate: interest ? parseFloat(interest) : 0,
        tenure_months: tenure ? parseInt(tenure) : null,
        min_due: minDue ? parseFloat(minDue) : null,
        start_date: startDate
      };

      const res = await createDebt(formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Debt added successfully!");
        setOpen(false);
        // reset form
        setName(""); setAmount(""); setInterest(""); setTenure(""); setStartDate(""); setMinDue("");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Debt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Liability</DialogTitle>
          <DialogDescription>
            Track a new loan, credit card, or borrowed money.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Type of Debt</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loan">Loan / Mortgage</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Name / Institution <span className="text-rose-500">*</span></Label>
            <Input required placeholder="e.g. HDFC Home Loan" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>{type === "credit_card" ? "Current Outstanding" : "Principal Amount"} <span className="text-rose-500">*</span></Label>
            <Input required type="number" min="0" step="0.01" placeholder="₹0.00" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>

          {type === "loan" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Interest Rate (% p.a)</Label>
                <Input type="number" min="0" step="0.01" placeholder="e.g. 8.5" value={interest} onChange={e => setInterest(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tenure (Months)</Label>
                <Input type="number" min="1" step="1" placeholder="e.g. 240" value={tenure} onChange={e => setTenure(e.target.value)} />
              </div>
            </div>
          )}

          {type === "credit_card" && (
            <div className="space-y-2">
              <Label>Minimum Due % (Optional)</Label>
              <Input type="number" min="0" step="0.1" placeholder="e.g. 5%" value={minDue} onChange={e => setMinDue(e.target.value)} />
            </div>
          )}

          <div className="space-y-2">
            <Label>{type === "credit_card" ? "Statement Date" : "Start Date"} <span className="text-rose-500">*</span></Label>
            <Input required type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Debt"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
