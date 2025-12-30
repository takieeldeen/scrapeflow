import React, { Suspense } from "react";
import Topbar from "../../_components/topbar/Topbar";
import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { InboxIcon, Loader2Icon } from "lucide-react";
import ExecutionsTable from "./_components/ExecutionsTable";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { WorkflowExecution } from "@/lib/generated/prisma/client";

async function AllExecutionsPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        hideActions
        title="All Runs"
        subtitle="List of all your workflow runs"
        workflowId={workflowId}
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full w-full">
            <Loader2Icon size={30} className="animate-spin stroke-primary" />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  );
}

export default AllExecutionsPage;

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["executions", workflowId],
    queryFn: () => GetWorkflowExecutions(workflowId),
  });
  const executions = queryClient.getQueryData<WorkflowExecution[]>([
    "executions",
    workflowId,
  ]);
  const dehydrateState = dehydrate(queryClient);

  if (!executions) return <div>No Data</div>;
  if (executions.length === 0)
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this workflow
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    );
  return (
    <HydrationBoundary state={dehydrateState}>
      <div className="container mx-auto  py-6 w-full">
        <ExecutionsTable workflowId={workflowId} initialData={executions} />
      </div>
    </HydrationBoundary>
  );
}
