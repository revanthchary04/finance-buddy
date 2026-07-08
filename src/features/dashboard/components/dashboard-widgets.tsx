"use client";

import { ArrowDownRight, ArrowUpRight, Building2, Calendar, Target, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function RecentTransactionsList({ transactions }: { transactions: any[] }) {
  const latest = transactions.slice(0, 10);

  if (latest.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <Calendar className="h-10 w-10 mb-3 opacity-20" />
        <p>No recent transactions</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {latest.map((tx) => {
        const isIncome = tx.type === "income";
        const isAsset = tx.type === "asset";
        
        return (
          <div key={tx.id} className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={`p-2 rounded-full shrink-0 ${
                isIncome 
                  ? "bg-emerald-500/10 text-emerald-500" 
                  : isAsset
                  ? "bg-blue-500/10 text-blue-500"
                  : "bg-rose-500/10 text-rose-500"
              }`}>
                {isIncome ? <ArrowUpRight className="h-4 w-4" /> : isAsset ? <Building2 className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground truncate">{tx.categories?.name || (isIncome ? 'Income' : isAsset ? 'Asset' : 'Expense')}</p>
              </div>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className={`font-semibold text-sm ${isIncome ? 'text-emerald-500' : isAsset ? 'text-blue-500' : 'text-foreground'}`}>
                {isIncome ? '+' : isAsset ? '' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DashboardWishlistWidget({ items }: { items: any[] }) {
  // Sort by priority (high -> medium -> low)
  const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
  
  const sortedItems = [...items]
    .filter(item => item.status === "active")
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])
    .slice(0, 5);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-500" />
          <h3 className="font-semibold text-sm">Wishlist Priorities</h3>
        </div>
        <Link href="/budgets">
          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground">
            View All
          </Button>
        </Link>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {sortedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
            <Target className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">No items in wishlist yet</p>
            <Link href="/budgets">
              <Button variant="outline" size="sm" className="mt-4">
                Add Item
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedItems.map(item => {
              const current = Number(item.current_amount) || 0;
              const target = Number(item.target_amount) || 0;
              const percent = target > 0 ? Math.min(100, (current / target) * 100) : 0;
              
              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium truncate pr-4">{item.name}</span>
                    <span className="font-semibold shrink-0">₹{target.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                    <div 
                      className={`h-full ${item.priority === 'high' ? 'bg-rose-500' : item.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{Math.round(percent)}% saved</span>
                    <span className="uppercase">{item.priority}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
