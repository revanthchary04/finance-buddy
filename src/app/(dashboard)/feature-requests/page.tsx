import { getUserFeatureRequests } from "@/features/requests/actions/requests.actions";
import { UserFeatureRequestsClient } from "@/features/requests/components/user-requests-client";

export default async function FeatureRequestsPage() {
  const requests = await getUserFeatureRequests();

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Feature Requests</h2>
      </div>
      <UserFeatureRequestsClient initialRequests={requests} />
    </div>
  );
}
