import { getAllUsers } from "@/features/admin/actions/admin.actions";
import { UserManagementTable } from "@/features/admin/components/user-management-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Application Users</CardTitle>
          <CardDescription>
            Manage user accounts, change roles, approve pending signups, or suspend access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
