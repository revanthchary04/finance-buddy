"use client";

import { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BudgetWarning, WarningLevel } from "../utils/financial-warnings";
import { CheckCircle2, ShieldCheck, Wallet } from "lucide-react";

interface WarningBannerProps {
  warningState: {
    warnings: BudgetWarning[];
    isAllSafeHands: boolean;
    fallbackWarning: { level: WarningLevel; message: string; description: string } | null;
  };
  hasBudgets: boolean;
}

export function FinancialWarningBanner({ warningState, hasBudgets }: WarningBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!hasBudgets && !warningState.fallbackWarning?.level) return;
    if (hasBudgets && warningState.warnings.length === 0 && !warningState.isAllSafeHands) return;

    // Use current date as part of the key so it resets every day
    const dateStr = new Date().toISOString().split("T")[0];
    const key = `finance-buddy-warning-dismissed-${dateStr}`;
    
    const dismissed = localStorage.getItem(key);
    if (dismissed !== "true") {
      setIsVisible(true);
    }
  }, [warningState]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    const key = `finance-buddy-warning-dismissed-${dateStr}`;
    localStorage.setItem(key, "true");
    setIsVisible(false);
  };

  // 1. No budgets setup
  if (!hasBudgets) {
    if (warningState.fallbackWarning?.level) {
      const w = warningState.fallbackWarning;
      const isCritical = w.level === "critical";
      const isWarning = w.level === "warning";
      
      const alertStyles = isCritical 
        ? "border-red-500/50 bg-red-500/10 text-red-500 dark:border-red-500/30" 
        : isWarning 
          ? "border-orange-500/50 bg-orange-500/10 text-orange-500 dark:border-orange-500/30" 
          : "border-yellow-500/50 bg-yellow-500/10 text-yellow-500 dark:border-yellow-500/30";

      const Icon = isCritical ? AlertCircle : AlertTriangle;

      return (
        <Alert className={`relative mb-6 ${alertStyles}`}>
          <Icon className={`h-4 w-4 ${isCritical ? "text-red-500" : isWarning ? "text-orange-500" : "text-yellow-500"}`} />
          <div className="flex-1">
            <AlertTitle className="font-bold">{w.message}</AlertTitle>
            <AlertDescription className="text-foreground mt-1">
              {w.description}
            </AlertDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:bg-transparent"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </Alert>
      );
    } else {
      return (
        <Alert className="relative mb-6 border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400">
          <Wallet className="h-4 w-4 text-blue-500" />
          <div className="flex-1">
            <AlertTitle className="font-bold">Set up budgets</AlertTitle>
            <AlertDescription className="text-foreground mt-1">
              Set up budgets to get personalized financial warnings and track your spending.
            </AlertDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:bg-transparent"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      );
    }
  }

  // 2. Safe Hands State
  if (warningState.isAllSafeHands) {
    return (
      <Alert className="relative mb-6 border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <ShieldCheck className="h-5 w-5 text-emerald-500" />
        <div className="flex-1 ml-1">
          <AlertTitle className="font-bold text-base">Your finances are in safe hands this month 🟢</AlertTitle>
          <AlertDescription className="text-emerald-700 dark:text-emerald-300 font-medium mt-1">
            All budgets on track. Keep it up!
          </AlertDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:bg-transparent"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    );
  }

  // 3. Render top 4 warnings
  if (warningState.warnings.length === 0) return null;

  return (
    <div className="mb-6 space-y-3 relative">
      <div className="absolute top-2 right-2 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-muted-foreground hover:bg-muted"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {warningState.warnings.map((w, idx) => {
        const isCritical = w.severity === "critical";
        const isWarning = w.severity === "warning";
        const isCaution = w.severity === "caution";
        
        const alertStyles = isCritical 
          ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400" 
          : isWarning 
            ? "border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400" 
            : "border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";

        const Icon = isCritical ? AlertCircle : isWarning ? AlertTriangle : AlertCircle;
        
        return (
          <Alert key={idx} className={`${alertStyles} py-3 pr-10`}>
            <Icon className={`h-4 w-4 ${isCritical ? "text-red-500" : isWarning ? "text-orange-500" : "text-yellow-500"}`} />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <AlertTitle className="font-semibold text-sm mb-0 flex items-center gap-2">
                {w.message}
              </AlertTitle>
              {w.remaining >= 0 && (
                <div className="text-xs font-medium opacity-80 shrink-0">
                  {Math.round(w.percentLeft * 100)}% remaining
                </div>
              )}
            </div>
          </Alert>
        );
      })}
    </div>
  );
}
