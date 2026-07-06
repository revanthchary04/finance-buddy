"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { createGlobalCategory, deleteGlobalCategory } from "../actions/admin.actions";
import { toast } from "sonner";
import { Plus, Tag, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function GlobalCategoryManager({ categories }: { categories: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    startTransition(async () => {
      const res = await createGlobalCategory(name, type);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Global category added!");
        setName("");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteGlobalCategory(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Category deleted");
      }
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Create Form */}
      <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl md:col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" /> Create Category
          </CardTitle>
          <CardDescription>
            Add global transaction categories available to all users across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Category Name</Label>
              <Input
                id="cat-name"
                placeholder="e.g. Subscriptions, Investments"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-type">Transaction Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Save Category
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl md:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Platform Global Categories</CardTitle>
          <CardDescription>
            Currently configured system-wide transaction tags.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-background/50 hover:bg-background/80 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl flex items-center justify-center ${
                      c.type === "income"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    }`}
                  >
                    {c.type === "income" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground capitalize mt-1">{c.type}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(c.id)}
                  disabled={isPending}
                  className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="col-span-full text-center py-12 border border-dashed rounded-xl bg-background/30 text-muted-foreground">
                No global categories created yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
