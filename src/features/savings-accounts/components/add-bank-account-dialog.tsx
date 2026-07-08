"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveBankAccount } from "../actions/bank.actions";
import { toast } from "sonner";
import { Building2, Plus, Loader2 } from "lucide-react";

export function AddBankAccountDialog({ editData, trigger }: { editData?: any, trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [bankName, setBankName] = useState(editData?.bank_name || "");
  const [accountType, setAccountType] = useState(editData?.account_type || "");
  const [lastFour, setLastFour] = useState(editData?.last_four_digits || "");
  const [balance, setBalance] = useState(editData?.current_balance?.toString() || "");
  const [notes, setNotes] = useState(editData?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveBankAccount(editData?.id || null, {
        bank_name: bankName,
        account_type: accountType,
        last_four_digits: lastFour,
        current_balance: balance,
        notes: notes
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(editData ? "Bank account updated!" : "Bank account added!");
        if (!editData) {
          setBankName("");
          setAccountType("");
          setLastFour("");
          setBalance("");
          setNotes("");
        }
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-500 text-white gap-2">
            <Plus className="w-4 h-4" /> Add Bank Account
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            {editData ? "Edit Bank Account" : "Add Bank Account"}
          </DialogTitle>
          <DialogDescription>
            {editData ? "Update your bank account details below." : "Link a bank account to track your liquid cash."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Bank Name</Label>
            <Input 
              placeholder="e.g. HDFC Bank, SBI" 
              value={bankName} 
              onChange={e => setBankName(e.target.value)} 
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select value={accountType} onValueChange={setAccountType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                  <SelectItem value="Fixed Deposit">Fixed Deposit</SelectItem>
                  <SelectItem value="NRE">NRE</SelectItem>
                  <SelectItem value="NRO">NRO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Last 4 Digits (Optional)</Label>
              <Input 
                placeholder="e.g. 1234" 
                maxLength={4}
                value={lastFour} 
                onChange={e => setLastFour(e.target.value.replace(/[^0-9]/g, ''))} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Balance (₹)</Label>
            <Input 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              value={balance} 
              onChange={e => setBalance(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea 
              placeholder="Any additional details..." 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-500 text-white">
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editData ? "Save Changes" : "Add Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
