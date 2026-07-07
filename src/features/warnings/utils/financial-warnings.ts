export type WarningLevel = 'caution' | 'warning' | 'critical' | null;

export function calculateWarningLevel(stats: any): {
  level: WarningLevel;
  message: string;
  description: string;
} {
  if (!stats) {
    return { level: null, message: '', description: '' };
  }

  const monthlyIncome = Number(stats.monthly_income) || 0;
  const monthlyExpenses = Number(stats.monthly_expenses) || 0;
  const lifetimeSavings = Number(stats.lifetime_savings) || 0;
  const allTimeIncome = Number(stats.all_time_income) || 0;
  const totalDebt = Number(stats.total_debt) || 0;
  const totalSavingsPool = Number(stats.total_savings_pool) || 0;

  const spendingRatio = monthlyIncome > 0 ? monthlyExpenses / monthlyIncome : (monthlyExpenses > 0 ? 1 : 0);
  const debtRatio = allTimeIncome > 0 ? totalDebt / allTimeIncome : (totalDebt > 0 ? 1 : 0);

  // Critical
  if (lifetimeSavings < 0) {
    return {
      level: 'critical',
      message: '🔴 Critical: Spending Beyond Your Means',
      description: 'Your total expenses exceed your total income. Immediate action needed.'
    };
  }
  if (debtRatio > 0.5) {
    return {
      level: 'critical',
      message: '🔴 Critical: High Debt Risk',
      description: 'Your debt exceeds 50% of your lifetime income. Consider debt reduction.'
    };
  }

  // Warning
  if (spendingRatio > 0.9 && monthlyIncome > 0) {
    return {
      level: 'warning',
      message: '🟠 Warning: Near Budget Limit',
      description: 'You have spent over 90% of this month\'s income. Slow down on expenses.'
    };
  }
  if (lifetimeSavings < totalSavingsPool) {
    return {
      level: 'warning',
      message: '🟠 Warning: Dipping Into Savings',
      description: 'Your spending is eating into your savings pool. Be cautious.'
    };
  }

  // Caution
  if (spendingRatio > 0.7 && monthlyIncome > 0) {
    return {
      level: 'caution',
      message: '🟡 Caution: High Spending This Month',
      description: 'You have spent over 70% of this month\'s income. Monitor your expenses.'
    };
  }

  return { level: null, message: '', description: '' };
}
