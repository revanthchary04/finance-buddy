import { getAuditLogs } from "@/features/admin/actions/logs.actions";
import { LogsClient } from "@/features/admin/components/logs-client";

export default async function AppLogsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const { logs: rawLogs, totalPages, currentPage } = await getAuditLogs(page);

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            App Logs
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Global authentication events and user activity across the application.
          </p>
        </div>
      </div>
      <LogsClient initialLogs={rawLogs} totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
