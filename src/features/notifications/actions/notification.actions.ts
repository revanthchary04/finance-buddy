"use server";

import { createClient } from "@/lib/supabase/server";

export async function getNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized", data: [] };

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching notifications:", error);
    return { error: error.message, data: [] };
  }

  return { success: true, data };
}

export async function markAsRead(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function markAllAsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) return { error: error.message };
  return { success: true };
}

export async function generateNotifications(
  budgets: any[], 
  stats: any, 
  debts: any[], 
  wishlistItems: any[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // 1. Fetch unread notifications to deduplicate
  const { data: unreadData } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_read", false);

  const unread = unreadData || [];

  // Also fetch all milestone notifications (even read ones) so we don't repeat them
  const { data: milestoneData } = await supabase
    .from("notifications")
    .select("metadata")
    .eq("user_id", user.id)
    .eq("type", "milestone");
  
  const sentMilestones = new Set((milestoneData || []).map(m => m.metadata?.amount).filter(Boolean));

  const newNotifications: any[] = [];

  // 1. Budget alerts (<5% remaining)
  if (budgets && stats?.expensesByCategory) {
    budgets.forEach(budget => {
      const spent = stats.expensesByCategory[budget.category_name] || 0;
      const limit = budget.amount;
      const remaining = limit - spent;
      const percentLeft = (remaining / limit) * 100;
      
      if (percentLeft < 5 && remaining >= 0) {
        // Check deduplication
        const exists = unread.some(n => 
          n.type === "budget_critical" && 
          n.metadata?.category_id === budget.id
        );
        
        if (!exists) {
          newNotifications.push({
            user_id: user.id,
            type: "budget_critical",
            message: `⚠️ Your ${budget.category_name} budget is critically low — only ₹${remaining.toLocaleString('en-IN')} left`,
            metadata: { category_id: budget.id }
          });
        }
      }
    });
  }

  // 2. Loan payment due (within 7 days)
  if (debts) {
    const now = new Date();
    debts.forEach(debt => {
      if (debt.type === 'loan' && debt.start_date && debt.tenure_months && debt.current_balance > 0) {
        const startDate = new Date(debt.start_date);
        
        // Find next payment date by adding months until it's in the future
        let nextDueDate = new Date(startDate);
        while (nextDueDate <= now) {
           nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        }
        
        // Check if within 7 days
        const diffTime = nextDueDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 7) {
          const exists = unread.some(n => 
            n.type === "loan_due" && 
            n.metadata?.debt_id === debt.id
          );
          
          if (!exists) {
            newNotifications.push({
              user_id: user.id,
              type: "loan_due",
              message: `📅 ${debt.name} EMI due soon`,
              metadata: { debt_id: debt.id }
            });
          }
        }
      }
    });
  }

  // 3. Wishlist goal reached
  if (wishlistItems) {
    wishlistItems.forEach(item => {
      if (item.saved_amount >= item.target_amount && item.target_amount > 0) {
        const exists = unread.some(n => 
          n.type === "wishlist_reached" && 
          n.metadata?.wishlist_id === item.id
        );
        
        if (!exists && item.status !== 'purchased') {
          newNotifications.push({
            user_id: user.id,
            type: "wishlist_reached",
            message: `🎯 You've saved enough for ${item.item_name}!`,
            metadata: { wishlist_id: item.id }
          });
        }
      }
    });
  }

  // 4. Positive milestone (True Net Worth)
  if (stats?.true_net_worth) {
    const netWorth = Number(stats.true_net_worth);
    const milestones = [100000, 500000, 1000000, 5000000, 10000000]; // 1L, 5L, 10L, 50L, 1Cr
    
    // Find the highest milestone reached
    const reached = milestones.filter(m => netWorth >= m).pop();
    
    if (reached && !sentMilestones.has(reached)) {
      newNotifications.push({
        user_id: user.id,
        type: "milestone",
        message: `🎉 Your net worth just crossed ₹${(reached / 100000).toFixed(1).replace('.0', '')} Lakhs!`,
        metadata: { amount: reached }
      });
    }
  }

  // Insert new notifications
  if (newNotifications.length > 0) {
    await supabase.from("notifications").insert(newNotifications);
  }

  return { success: true };
}
