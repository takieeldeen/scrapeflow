import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import Editor from "../../_components/Editor";

async function WorkflowEditorPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  const { userId } = await auth();
  if (!userId) return <div>User not authenticated</div>;
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId, userId },
  });
  if (!workflow) return <div>Workflow Not found</div>;
  return <Editor workflow={workflow} />;
}

export default WorkflowEditorPage;
