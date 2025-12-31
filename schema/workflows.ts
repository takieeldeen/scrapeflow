import z from "zod";

export const createWorkflowSchmea = z.object({
  name: z.string().min(1),
  description: z.string().max(80).optional(),
});

export type CreateWorkflowSchemaType = z.infer<typeof createWorkflowSchmea>;

export const duplicateWorkflowSchema = createWorkflowSchmea.extend({
  workflowId: z.string(),
});

export type duplicateWorkflowSchemaType = z.infer<
  typeof duplicateWorkflowSchema
>;
