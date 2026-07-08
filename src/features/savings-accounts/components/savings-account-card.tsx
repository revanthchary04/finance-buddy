"use client";

import { useState } from "react";
import { Plus, Clock, Pencil } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddFundsDialog } from "./add-funds-dialog";
import { SavingsHistoryDrawer } from "./savings-history-drawer";
import { AddSavingsAccountDialog } from "./add-savings-account-dialog";

export function SavingsAccountCard({ account }: { account: any }) {
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col @container/card border-border/50 bg-card overflow-hidden shadow-sm hover:shadow-primary/20 hover:border-primary/40 transition-all duration-300 dark:bg-card/60 dark:backdrop-blur-xl relative">
        {/* Colored gradient accent bar at the top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/40" />

        <CardHeader className="pb-2 pt-6">
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl font-bold truncate text-foreground tracking-tight" title={account.name}>
              {account.name}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mt-2 -mr-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-sm text-muted-foreground/80 line-clamp-2 mt-1" title={account.description}>
            {account.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="py-4 mt-auto">
          <div className="text-4xl font-black tabular-nums text-emerald-500 tracking-tight">
            ₹{Number(account.balance).toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-muted-foreground mt-2 font-medium">
            Total contributed: ₹{Number(account.balance).toLocaleString("en-IN")}
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2 pt-0 mt-auto pb-6">
          <Button 
            variant="default" 
            className="flex-1 gap-2 font-semibold shadow-md hover:shadow-lg transition-all" 
            onClick={() => setIsAddFundsOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Funds
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="w-10 shrink-0 border-border/60 hover:bg-muted" 
            onClick={() => setIsHistoryOpen(true)}
            title="View History"
          >
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">History</span>
          </Button>
        </CardFooter>
      </Card>

      <AddFundsDialog 
        open={isAddFundsOpen} 
        onOpenChange={setIsAddFundsOpen} 
        account={account} 
      />
      
      <SavingsHistoryDrawer 
        open={isHistoryOpen} 
        onOpenChange={setIsHistoryOpen} 
        account={account} 
      />
      
      <AddSavingsAccountDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        editData={account} 
      />
    </>
  );
}
