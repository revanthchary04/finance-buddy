import { getCategories } from "@/features/transactions/actions/transaction.actions";
import { GlobalCategoryManager } from "@/features/admin/components/global-category-manager";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="pb-2 border-b">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Category Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage system-wide global categories for expenses and income deposits.
        </p>
      </div>

      <GlobalCategoryManager categories={categories} />
    </div>
  );
}
