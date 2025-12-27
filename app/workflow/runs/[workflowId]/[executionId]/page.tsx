import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { auth } from "@clerk/nextjs/server";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails";

async function WorkflowExecutionPage({
  params,
}: {
  params: { executionId: string; workflowId: string };
}) {
  const { workflowId, executionId } = await params;
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        workflowId={workflowId}
        title="Workflow run details"
        subtitle={`Run ID : ${executionId}`}
        hideActions
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full h-full items-center justify-center">
              <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
}

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const { userId } = await auth();
  if (!userId) return <div>unauthenticated</div>;
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
  if (!workflowExecution) return <div>No Execution Found</div>;
  return (
    <ExecutionViewer
      initialData={workflowExecution}
      fetchExecutionDetails={GetWorkflowExecutionWithPhases}
      fetchPhaseDetails={GetWorkflowPhaseDetails}
    />
  );
}

export default WorkflowExecutionPage;
