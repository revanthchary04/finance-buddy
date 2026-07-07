"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Plus, Target, TrendingUp } from "lucide-react";
import { createSavings, addContribution } from "../actions/savings.actions";
import { toast } from "sonner";

export function SavingsSection({ savings }: { savings: any[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7) + "-01");
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return toast.error("Please fill required fields");

    startTransition(async () => {
      const res = await createSavings({
        name,
        target_amount: Number(targetAmount),
        month
      });
      if (res.error) toast.error(res.error);
      else {
        toast.success("Savings goal created!");
        setOpen(false);
        setName("");
        setTargetAmount("");
      }
    });
  };

  return (
    <div className="space-y-6 mt-12 border-t pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <PiggyBank className="text-primary w-6 h-6" /> Savings Goals
          </h3>
          <p className="text-muted-foreground text-sm mt-1">Track your progress toward financial milestones.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border/60 bg-card/95 backdrop-blur-2xl">
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
              <DialogDescription>Set a target amount to save for a specific month.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Goal Name <span className="text-red-500">*</span></Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Vacation Fund" required className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label>Target Amount (₹) <span className="text-red-500">*</span></Label>
                <Input type="number" step="0.01" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="0.00" required className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label>Target Month <span className="text-red-500">*</span></Label>
                <Input type="date" value={month} onChange={e => setMonth(e.target.value)} required className="bg-background/50" />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Create Goal"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {savings.length === 0 ? (
          <div className="col-span-full border-dashed border p-12 text-center text-muted-foreground rounded-xl bg-card/30">
            No savings goals found. Create your first goal to start tracking!
          </div>
        ) : (
          savings.map(goal => <SavingsCard key={goal.id} goal={goal} />)
        )}
      </div>
    </div>
  );
}

function SavingsCard({ goal }: { goal: any }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  const progress = Math.min(100, Math.max(0, (goal.current_amount / goal.target_amount) * 100));
  
  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return toast.error("Invalid amount");

    startTransition(async () => {
      const res = await addContribution(goal.id, Number(amount));
      if (res.error) toast.error(res.error);
      else {
        toast.success("Contribution added!");
        setOpen(false);
        setAmount("");
      }
    });
  };

  return (
    <Card className="shadow-lg border-border/50 relative overflow-hidden group bg-card/60 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{goal.name}</CardTitle>
            <CardDescription>
              Due: {new Date(goal.month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </CardDescription>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <Target className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-2xl font-bold text-foreground">₹{Number(goal.current_amount).toLocaleString('en-IN')}</p>
              <p className="text-xs text-muted-foreground">Saved</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">₹{Number(goal.target_amount).toLocaleString('en-IN')}</p>
              <p className="text-xs text-muted-foreground">Target</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-right mt-1 text-muted-foreground">{progress.toFixed(1)}%</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full bg-background/50 hover:bg-background">
              <TrendingUp className="w-4 h-4 mr-2" /> Add Contribution
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border/60 bg-card/95 backdrop-blur-2xl">
            <DialogHeader>
              <DialogTitle>Add Contribution</DialogTitle>
              <DialogDescription>Add funds to {goal.name}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleContribute} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Amount (₹) <span className="text-red-500">*</span></Label>
                <Input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required className="bg-background/50" />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isPending}>{isPending ? "Adding..." : "Confirm"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
