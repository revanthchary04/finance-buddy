import { FinancialAnalytics } from "@/features/reports/components/financial-analytics";

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="pb-2 border-b">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Reports & Analytics
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Deep-dive visual breakdown of your financial flows and spending patterns.
        </p>
      </div>

      {/* Analytics Charts */}
      <FinancialAnalytics />
    </div>
  );
}
