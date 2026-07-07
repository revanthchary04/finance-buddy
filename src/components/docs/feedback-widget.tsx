"use client";

import { toast } from "sonner";

export function FeedbackWidget() {
  const handleFeedback = (emoji: string) => {
    toast.success("Thank you for your feedback!");
  };

  return (
    <div className="mt-16 pt-8 border-t flex flex-col items-end">
      <p className="text-sm text-muted-foreground mb-3 font-medium">Was this helpful?</p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleFeedback("👍")}
          className="h-10 w-10 flex items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors text-lg"
          aria-label="Helpful"
        >
          👍
        </button>
        <button
          onClick={() => handleFeedback("😐")}
          className="h-10 w-10 flex items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors text-lg"
          aria-label="Neutral"
        >
          😐
        </button>
        <button
          onClick={() => handleFeedback("👎")}
          className="h-10 w-10 flex items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors text-lg"
          aria-label="Not helpful"
        >
          👎
        </button>
      </div>
    </div>
  );
}
