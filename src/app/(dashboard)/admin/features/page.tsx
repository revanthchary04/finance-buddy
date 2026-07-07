import { getAllFeatureRequests } from "@/features/requests/actions/requests.actions";
import { AdminFeatureRequestsClient } from "@/features/requests/components/admin-requests-client";

export default async function AdminFeatureRequestsPage() {
  const requests = await getAllFeatureRequests();

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Feature Requests</h2>
      </div>
      <AdminFeatureRequestsClient initialRequests={requests} />
    </div>
  );
}
