"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteTransaction } from "../actions/transaction.actions";
import { toast } from "sonner";
import { Search, ArrowUpRight, ArrowDownRight, Trash2, Calendar, Tag, Pencil, Building2 } from "lucide-react";
import { AddTransactionDialog } from "./add-transaction-dialog";

export function TransactionsTable({ transactions, categories }: { transactions: any[], categories: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense" | "asset">("all");
  const [isPending, startTransition] = useTransition();

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteTransaction(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Transaction deleted");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Search & Type Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background/50 border-border/60"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border/40 self-start sm:self-auto">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterType === "all"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType("income")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterType === "income"
                ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilterType("expense")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterType === "expense"
                ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setFilterType("asset")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterType === "asset"
                ? "bg-blue-500/15 text-blue-500 border border-blue-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Asset
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border/50 overflow-x-auto w-full bg-card/40 backdrop-blur-xl">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="min-w-[230px]">Type & Description</TableHead>
              <TableHead className="min-w-[120px]">Category</TableHead>
              <TableHead className="min-w-[100px]">Date</TableHead>
              <TableHead className="text-right min-w-[100px]">Amount</TableHead>
              <TableHead className="text-right min-w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((t) => (
              <TableRow key={t.id} className="hover:bg-muted/30 border-border/40 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl flex items-center justify-center ${
                        t.type === "income"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : t.type === "expense"
                          ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      }`}
                    >
                      {t.type === "income" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : t.type === "expense" ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : (
                        <Building2 className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm leading-tight text-foreground">
                        {t.description || (t.type === "income" ? "Income Deposit" : t.type === "expense" ? "Expense Payment" : "Asset")}
                      </span>
                      <span className="text-[11px] text-muted-foreground capitalize mt-0.5">
                        {t.type}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-border/60 text-xs font-normal gap-1">
                    <Tag className="h-3 w-3 text-primary" />
                    {t.categories?.name || "General"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold text-sm">
                  <span className={t.type === "income" ? "text-emerald-500" : t.type === "expense" ? "text-rose-500" : "text-blue-500"}>
                    {t.type === "income" ? "+" : t.type === "expense" ? "-" : ""}₹{Number(t.amount).toLocaleString("en-IN")}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <AddTransactionDialog 
                      categories={categories} 
                      editData={t} 
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                          className="h-8 w-8 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      } 
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(t.id)}
                      disabled={isPending}
                      className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
