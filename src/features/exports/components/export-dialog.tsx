"use client";

import { useState, useTransition } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { exportUserData } from "../actions/export.actions";
import { toast } from "sonner";

export function ExportDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [exportType, setExportType] = useState<"this_month" | "select_month" | "all_time">("this_month");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Generate last 12 months for the dropdown
  const last12Months = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthValue = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    return { value: monthValue, label: monthLabel };
  });

  const handleExport = () => {
    startTransition(async () => {
      try {
        let filter: "monthly" | "all" = "all";
        let monthParam: string | undefined = undefined;

        if (exportType === "this_month") {
          filter = "monthly";
          const d = new Date();
          monthParam = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        } else if (exportType === "select_month") {
          if (!selectedMonth) {
            toast.error("Please select a month");
            return;
          }
          filter = "monthly";
          monthParam = selectedMonth;
        }

        const transactions = await exportUserData(filter, monthParam);

        if (!transactions || transactions.length === 0) {
          toast.error("No transactions found for the selected period.");
          return;
        }

        const ws = XLSX.utils.json_to_sheet(
          transactions.map((t: any) => ({
            Date: t.date,
            Description: t.description,
            Category: t.category?.name || "Uncategorized",
            Type: t.type,
            Amount: Number(t.amount),
            Location: t.location || "",
          }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transactions");
        XLSX.writeFile(wb, `finance-buddy-${filter}${monthParam ? `-${monthParam}` : ''}-${new Date().toISOString().slice(0, 10)}.xlsx`);

        toast.success("Data exported successfully!");
        setIsOpen(false);
      } catch (error: any) {
        toast.error(error.message || "Failed to export data");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Export to Excel
          </DialogTitle>
          <DialogDescription>
            Download your financial data as an .xlsx file for personal analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="export-type">Export Period</Label>
            <Select value={exportType} onValueChange={(value: any) => setExportType(value)}>
              <SelectTrigger id="export-type">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="select_month">Select Month...</SelectItem>
                <SelectItem value="all_time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {exportType === "select_month" && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <Label htmlFor="month-select">Choose Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger id="month-select">
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                  {last12Months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isPending}>
            {isPending ? "Generating..." : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
