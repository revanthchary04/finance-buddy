"use client";

import { useEffect, useState } from "react";
import { IconTrendingUp, IconTrendingDown, IconWallet, IconActivity, IconPigMoney } from "@tabler/icons-react";
import { Landmark, GripVertical, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Sortable Item Wrapper ---
function SortableCard({ 
  id, 
  isArrangeMode, 
  children 
}: { 
  id: string; 
  isArrangeMode: boolean; 
  children: React.ReactNode 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isArrangeMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative ${isArrangeMode ? "cursor-grab active:cursor-grabbing" : ""}`} {...attributes} {...listeners}>
      {children}
      {isArrangeMode && (
        <div className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-md shadow-sm border border-border/50 text-muted-foreground hover:text-foreground transition-colors cursor-grab">
          <GripVertical className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

const DEFAULT_ORDER = [
  "lifetime-savings",
  "savings-pool",
  "bank-balance",
  "true-net-worth",
  "this-month",
  "total-debt",
  "transactions"
];

export function FintechSectionCards({
  lifetimeSavings,
  trueNetWorth,
  monthlyIncome,
  monthlyExpenses,
  monthlyNet,
  totalDebt,
  transactionCount,
  totalSavingsPool,
  totalBankBalance,
}: {
  lifetimeSavings: number;
  trueNetWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyNet: number;
  totalDebt: number;
  transactionCount: number;
  totalSavingsPool: number;
  totalBankBalance: number;
}) {
  const isSavingsPos = lifetimeSavings >= 0;
  const isWorthPos = trueNetWorth >= 0;
  const isNetPos = monthlyNet >= 0;
  const hasDebt = totalDebt > 0;

  const [isArrangeMode, setIsArrangeMode] = useState(false);
  const [items, setItems] = useState<string[]>(DEFAULT_ORDER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedOrder = localStorage.getItem("finance-buddy-card-order");
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        // Ensure all default keys exist in the parsed order
        const isValid = parsed.length === DEFAULT_ORDER.length && parsed.every((id: string) => DEFAULT_ORDER.includes(id));
        if (isValid) {
          setItems(parsed);
        }
      } catch (e) {
        // use default
      }
    }

    const handleToggle = (e: any) => {
      setIsArrangeMode(e.detail);
    };
    window.addEventListener("toggleArrangeMode", handleToggle);
    return () => window.removeEventListener("toggleArrangeMode", handleToggle);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem("finance-buddy-card-order", JSON.stringify(newOrder));
        return newOrder;
      });
    }
  }

  // Define the content for each card
  const cardData: Record<string, React.ReactNode> = {
    "lifetime-savings": (
      <Card className="@container/card border-border/50 min-h-[160px] h-[160px] flex flex-col justify-between">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs text-foreground/80">Lifetime Savings</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[10px] px-1.5 py-0.5 ${isSavingsPos ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : "border-rose-500/30 text-rose-500 bg-rose-500/10"}`}>
              {isSavingsPos ? <IconTrendingUp className="size-3" /> : <IconTrendingDown className="size-3" />} Primary
            </Badge>
          </div>
          <CardTitle className={`text-2xl font-bold tabular-nums mt-1 ${isSavingsPos ? "text-emerald-500" : "text-rose-500"}`}>
            ₹{lifetimeSavings.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className="text-[11px] text-muted-foreground/80">Accumulated wealth</div>
        </CardFooter>
      </Card>
    ),
    "savings-pool": (
      <Card className="@container/card border-border/50 min-h-[160px] h-[160px] flex flex-col justify-between">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs text-foreground/80">Total in Savings</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[10px] px-1.5 py-0.5 border-blue-500/30 text-blue-500 bg-blue-500/10`}>
              <IconPigMoney className="size-3" /> Vault
            </Badge>
          </div>
          <CardTitle className={`text-2xl font-bold tabular-nums mt-1 text-blue-500`}>
            ₹{totalSavingsPool.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className="text-[11px] text-muted-foreground/80">Across all accounts</div>
        </CardFooter>
      </Card>
    ),
    "bank-balance": (
      <Card className="@container/card border-border/50 min-h-[160px] h-[160px] flex flex-col justify-between">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Total in Banks</CardDescription>
            <Badge variant="outline" className="gap-1 text-[10px] px-1.5 py-0.5 border-cyan-500/30 text-cyan-500 bg-cyan-500/10">
              <Building2 className="size-3" /> Liquid
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums mt-1 text-cyan-600">
            ₹{totalBankBalance.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className="text-[11px]">Liquid cash across accounts</div>
        </CardFooter>
      </Card>
    ),
    "true-net-worth": (
      <Card className="@container/card border-border/50 min-h-[160px] h-[160px] flex flex-col justify-between">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">True Net Worth</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[10px] px-1.5 py-0.5 ${isWorthPos ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : "border-rose-500/30 text-rose-500 bg-rose-500/10"}`}>
              <IconWallet className="size-3" /> Assets
            </Badge>
          </div>
          <CardTitle className={`text-2xl font-semibold tabular-nums mt-1 ${isWorthPos ? "text-foreground" : "text-rose-500"}`}>
            ₹{trueNetWorth.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className="text-[11px]">Assets - Debt</div>
        </CardFooter>
      </Card>
    ),
    "this-month": (
      <Card className="@container/card border-border/50 min-h-[160px] h-[160px] flex flex-col justify-between">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">This Month</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[10px] px-1.5 py-0.5 ${isNetPos ? "border-blue-500/30 text-blue-400 bg-blue-500/10" : "border-rose-500/30 text-rose-500 bg-rose-500/10"}`}>
              {isNetPos ? <IconTrendingUp className="size-3" /> : <IconTrendingDown className="size-3" />} Net
            </Badge>
          </div>
          <CardTitle className={`text-2xl font-semibold tabular-nums mt-1 ${isNetPos ? "text-blue-400" : "text-rose-500"}`}>
            ₹{monthlyNet.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 text-xs text-muted-foreground pt-0">
          <div className="text-[11px] text-emerald-500 truncate w-full">↑ ₹{monthlyIncome.toLocaleString("en-IN")} in</div>
          <div className="text-[11px] text-rose-500 truncate w-full">↓ ₹{monthlyExpenses.toLocaleString("en-IN")} out</div>
        </CardFooter>
      </Card>
    ),
    "total-debt": (
      <Card className="@container/card border-border/50 min-h-[160px] h-[160px] flex flex-col justify-between">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Total Debt</CardDescription>
            <Badge variant="outline" className={`gap-1 text-[10px] px-1.5 py-0.5 ${hasDebt ? "border-rose-500/30 text-rose-500 bg-rose-500/10" : "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"}`}>
              <Landmark className="size-3" /> {hasDebt ? "Active" : "Clear"}
            </Badge>
          </div>
          <CardTitle className={`text-2xl font-semibold tabular-nums mt-1 ${hasDebt ? "text-rose-500" : "text-emerald-500"}`}>
            {hasDebt ? `₹${totalDebt.toLocaleString("en-IN")}` : "Debt Free"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className="text-[11px]">Active liabilities</div>
        </CardFooter>
      </Card>
    ),
    "transactions": (
      <Card className="@container/card border-border/50 min-h-[160px] h-[160px] flex flex-col justify-between">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium text-xs">Transactions</CardDescription>
            <Badge variant="outline" className="gap-1 text-[10px] px-1.5 py-0.5 border-purple-500/30 text-purple-400 bg-purple-500/10">
              <IconActivity className="size-3" /> Log
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums mt-1 text-foreground">
            {transactionCount}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pt-0">
          <div className="text-[11px]">Total entries</div>
        </CardFooter>
      </Card>
    )
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch on initial render
  }

  return (
    <div className="relative">
      {isArrangeMode && (
        <div className="absolute -top-7 right-0 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-t-md border-x border-t border-amber-500/30 animate-in fade-in slide-in-from-bottom-2">
          Drag to rearrange
        </div>
      )}
      
      <div className={`transition-all duration-300 rounded-xl ${isArrangeMode ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-background p-2 -m-2 bg-amber-500/5" : ""}`}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card/60 dark:*:data-[slot=card]:backdrop-blur-xl">
            <SortableContext
              items={items}
              strategy={horizontalListSortingStrategy}
            >
              {items.map((id) => (
                <SortableCard key={id} id={id} isArrangeMode={isArrangeMode}>
                  {cardData[id]}
                </SortableCard>
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
