"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Play, 
  CreditCard, 
  Target, 
  Landmark, 
  Briefcase, 
  Heart, 
  BarChart, 
  Calculator, 
  Activity, 
  AlertTriangle,
  UserCheck,
  Shield,
  FileText,
  Tags,
  Server,
  Database,
  Lock,
  GitCommit,
  FolderTree
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navigation = [
  {
    title: "GETTING STARTED",
    links: [
      { title: "Introduction", href: "/docs/getting-started", icon: Play },
    ],
  },
  {
    title: "FEATURES",
    links: [
      { title: "Transactions", href: "/docs/features/transactions", icon: CreditCard },
      { title: "Budgets", href: "/docs/features/budgets", icon: Target },
      { title: "Categories", href: "/docs/features/categories", icon: FolderTree },
      { title: "Savings Accounts", href: "/docs/features/savings-accounts", icon: Landmark },
      { title: "Debts & Loans", href: "/docs/features/debts", icon: Briefcase },
      { title: "Wishlist & Goals", href: "/docs/features/wishlist", icon: Heart },
      { title: "Reports & Analytics", href: "/docs/features/reports", icon: BarChart },
    ],
  },
  {
    title: "CALCULATIONS",
    links: [
      { title: "Lifetime Savings", href: "/docs/calculations/lifetime-savings", icon: Calculator },
      { title: "True Net Worth", href: "/docs/calculations/true-net-worth", icon: Activity },
      { title: "EMI Calculation", href: "/docs/calculations/emi", icon: Calculator },
      { title: "Financial Warnings", href: "/docs/calculations/financial-warnings", icon: AlertTriangle },
    ],
  },
  {
    title: "ADMIN GUIDE",
    links: [
      { title: "Approving Users", href: "/docs/admin/approving-users", icon: UserCheck },
      { title: "Role Management", href: "/docs/admin/roles", icon: Shield },
      { title: "App Logs & Sessions", href: "/docs/admin/logs", icon: FileText },
      { title: "Category Management", href: "/docs/admin/categories", icon: Tags },
    ],
  },
  {
    title: "TECH STACK",
    links: [
      { title: "Architecture", href: "/docs/tech/architecture", icon: Server },
      { title: "Database Schema", href: "/docs/tech/database-schema", icon: Database },
      { title: "Auth & Security", href: "/docs/tech/auth-security", icon: Lock },
    ],
  },
  {
    title: "CHANGELOG",
    links: [
      { title: "v1.0.0", href: "/docs/changelog/v1.0.0", icon: GitCommit },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full h-full flex flex-col justify-between py-6 pr-6">
      <div className="w-full">
        {/* Version Badge Header */}
        <div className="px-3 pb-6 mb-2 border-b border-border/50">
          <Badge variant="outline" className="font-mono text-xs bg-muted text-muted-foreground hover:bg-muted">
            v1.0.0
          </Badge>
        </div>

        {navigation.map((section, i) => (
          <div key={i} className="pb-8">
            <h4 className="mb-3 px-3 text-[11px] font-bold text-muted-foreground tracking-wider">
              {section.title}
            </h4>
            <div className="grid grid-flow-row auto-rows-max text-sm gap-0.5">
              {section.links.map((link, j) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={j}
                    href={link.href}
                    className={`group flex w-full items-center gap-3 rounded-r-md border-l-2 px-3 py-2 transition-colors ${
                      isActive
                        ? "border-primary bg-primary/5 text-foreground font-medium"
                        : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <link.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                    {link.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-xs text-muted-foreground px-3">
        <a href="https://originlabs.in" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
          Powered by <span className="font-semibold text-foreground">OriginLabs</span>
        </a>
      </div>
    </div>
  );
}
