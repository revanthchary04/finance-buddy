export type WarningLevel = 'caution' | 'warning' | 'critical' | 'healthy' | null;

export interface BudgetWarning {
  category: string;
  remaining: number;
  limit: number;
  percentLeft: number;
  severity: WarningLevel;
  message: string;
}

export function calculateBudgetWarnings(budgets: any[], stats?: any): {
  warnings: BudgetWarning[];
  isAllSafeHands: boolean;
  fallbackWarning: { level: WarningLevel; message: string; description: string } | null;
} {
  const warnings: BudgetWarning[] = [];
  let isAllSafeHands = true;
  let fallbackWarning = null;

  if (budgets && budgets.length > 0) {
    budgets.forEach((budget) => {
      const limit = Number(budget.amount) || 0;
      const spent = Number(budget.spent) || 0;
      const remaining = limit - spent;
      const percentLeft = limit > 0 ? (remaining / limit) : 0;
      const category = budget.categories?.name || budget.name;

      let severity: WarningLevel = 'healthy';
      let message = '';

      if (percentLeft < 0.05 || remaining < 0) {
        severity = 'critical';
        isAllSafeHands = false;
        if (remaining < 0) {
          message = `⚠️ ${category} budget exceeded by ₹${Math.abs(remaining).toLocaleString("en-IN")}`;
        } else {
          message = `⚠️ Only ₹${remaining.toLocaleString("en-IN")} left in ${category} — critically low`;
        }
      } else if (percentLeft <= 0.15) {
        severity = 'warning';
        isAllSafeHands = false;
        message = `Only ₹${remaining.toLocaleString("en-IN")} left in ${category} this month`;
      } else if (percentLeft <= 0.30) {
        severity = 'caution';
        isAllSafeHands = false;
        message = `₹${remaining.toLocaleString("en-IN")} left in ${category} — spending mindfully`;
      } else {
        severity = 'healthy';
      }

      warnings.push({
        category,
        remaining,
        limit,
        percentLeft,
        severity,
        message
      });
    });
  } else {
    isAllSafeHands = false; // No budgets means no safe hands
    
    // Fallback global stats logic
    if (stats) {
      const monthlyIncome = Number(stats.monthly_income) || 0;
      const monthlyExpenses = Number(stats.monthly_expenses) || 0;
      const lifetimeSavings = Number(stats.lifetime_savings) || 0;
      const allTimeIncome = Number(stats.all_time_income) || 0;
      const totalDebt = Number(stats.total_debt) || 0;
      const totalSavingsPool = Number(stats.total_savings_pool) || 0;

      const spendingRatio = monthlyIncome > 0 ? monthlyExpenses / monthlyIncome : (monthlyExpenses > 0 ? 1 : 0);
      const debtRatio = allTimeIncome > 0 ? totalDebt / allTimeIncome : (totalDebt > 0 ? 1 : 0);

      if (lifetimeSavings < 0) {
        fallbackWarning = {
          level: 'critical' as WarningLevel,
          message: '🔴 Critical: Spending Beyond Your Means',
          description: 'Your total expenses exceed your total income. Immediate action needed.'
        };
      } else if (debtRatio > 0.5) {
        fallbackWarning = {
          level: 'critical' as WarningLevel,
          message: '🔴 Critical: High Debt Risk',
          description: 'Your debt exceeds 50% of your lifetime income. Consider debt reduction.'
        };
      } else if (spendingRatio > 0.9 && monthlyIncome > 0) {
        fallbackWarning = {
          level: 'warning' as WarningLevel,
          message: '🟠 Warning: Near Budget Limit',
          description: 'You have spent over 90% of this month\'s income. Slow down on expenses.'
        };
      } else if (lifetimeSavings < totalSavingsPool) {
        fallbackWarning = {
          level: 'warning' as WarningLevel,
          message: '🟠 Warning: Dipping Into Savings',
          description: 'Your spending is eating into your savings pool. Be cautious.'
        };
      } else if (spendingRatio > 0.7 && monthlyIncome > 0) {
        fallbackWarning = {
          level: 'caution' as WarningLevel,
          message: '🟡 Caution: High Spending This Month',
          description: 'You have spent over 70% of this month\'s income. Monitor your expenses.'
        };
      }
    }
  }

  // Sort warnings: Critical first, then Warning, then Caution. Skip Healthy.
  const filteredWarnings = warnings.filter(w => w.severity !== 'healthy').sort((a, b) => {
    const severityOrder = { 'critical': 3, 'warning': 2, 'caution': 1, 'healthy': 0 };
    return (severityOrder[b.severity as keyof typeof severityOrder] || 0) - (severityOrder[a.severity as keyof typeof severityOrder] || 0) || a.remaining - b.remaining;
  });

  return {
    warnings: filteredWarnings.slice(0, 4), // Return top 4 worst
    isAllSafeHands,
    fallbackWarning
  };
}
