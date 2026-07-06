import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Settings,
  Shield,
  Users,
  UserCheck,
  Tag,
  History,
} from "lucide-react";

export const navigationConfig = {
  user: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { title: "Budgets", href: "/budgets", icon: PiggyBank },
    { title: "Reports", href: "/reports", icon: BarChart3 },
    { title: "Settings", href: "/settings", icon: Settings },
  ],
  admin: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { title: "Budgets", href: "/budgets", icon: PiggyBank },
    { title: "Reports", href: "/reports", icon: BarChart3 },
    { title: "Settings", href: "/settings", icon: Settings },
    { title: "Admin Overview", href: "/admin", icon: Shield },
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Pending Approvals", href: "/admin/pending", icon: UserCheck },
    { title: "Categories", href: "/admin/categories", icon: Tag },
    { title: "App Logs", href: "/admin/logs", icon: History },
  ],
};
