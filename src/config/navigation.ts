import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  CreditCard,
  ShoppingCart,
  BarChart3,
  Settings,
  Shield,
  Users,
  UserCheck,
  Tag,
  History,
  Lightbulb,
} from "lucide-react";

export const navigationConfig = {
  user: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { title: "Budgets & Wishlist", href: "/budgets", icon: PiggyBank },
    { title: "Debts", href: "/debts", icon: CreditCard },
    { title: "Reports", href: "/reports", icon: BarChart3 },
  ],
  admin: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { title: "Budgets & Wishlist", href: "/budgets", icon: PiggyBank },
    { title: "Debts", href: "/debts", icon: CreditCard },
    { title: "Reports", href: "/reports", icon: BarChart3 },
    { title: "Admin Overview", href: "/admin", icon: Shield },
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Pending Approvals", href: "/admin/pending", icon: UserCheck },
    { title: "Categories", href: "/admin/categories", icon: Tag },
    { title: "App Logs", href: "/admin/logs", icon: History },
    { title: "Manage Features", href: "/admin/features", icon: Lightbulb },
  ],
};
