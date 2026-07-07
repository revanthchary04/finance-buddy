"use client";

import { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WarningLevel } from "../utils/financial-warnings";

interface WarningBannerProps {
  warning: {
    level: WarningLevel;
    message: string;
    description: string;
  };
}

export function FinancialWarningBanner({ warning }: WarningBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!warning.level) return;

    // Use current date as part of the key so it resets every day
    const dateStr = new Date().toISOString().split("T")[0];
    const key = `finance-buddy-warning-dismissed-${dateStr}`;
    
    const dismissed = localStorage.getItem(key);
    if (dismissed !== "true") {
      setIsVisible(true);
    }
  }, [warning.level]);

  if (!isVisible || !warning.level) return null;

  const handleDismiss = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    const key = `finance-buddy-warning-dismissed-${dateStr}`;
    localStorage.setItem(key, "true");
    setIsVisible(false);
  };

  const isCritical = warning.level === "critical";
  const isWarning = warning.level === "warning";
  
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
        <AlertTitle className="font-bold">{warning.message}</AlertTitle>
        <AlertDescription className="text-foreground mt-1">
          {warning.description}
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
}
