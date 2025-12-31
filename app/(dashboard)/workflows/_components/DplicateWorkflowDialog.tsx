"use client";

import CustomDialogHeader from "@/components/customDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CopyIcon, Layers2Icon, Loader2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "@/schema/workflows";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { duplicateWorkflow } from "@/actions/workflows/duplicateWorkflow";
import { cn } from "@/lib/utils";

function DuplicateWorkflowDialog({ workflowId }: { workflowId: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const defaultValues = useMemo(
    () => ({
      workflowId: "",
      name: "",
      description: "",
    }),
    []
  );
  const form = useForm<duplicateWorkflowSchemaType>({
    defaultValues,
    resolver: zodResolver(duplicateWorkflowSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: duplicateWorkflow,
    onSuccess: () => {
      toast.success("Workflow duplicated", { id: "duplicate-workflow" });
    },
    onError: () => {
      toast.success("Failed to duplicate workflow", {
        id: "duplicate-workflow",
      });
    },
  });
  const onSubmit = useCallback(
    (values: duplicateWorkflowSchemaType) => {
      toast.loading("Duplicating Workflow...", { id: "duplicate-workflow" });
      mutate({ ...values, workflowId });
      setOpen(false);
    },
    [mutate, workflowId]
  );
  return (
    <Dialog
      open={open}
      onOpenChange={(ope) => {
        setOpen(ope);
        form.reset();
      }}
      modal
    >
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className={cn(
            "ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100 cursor-pointer"
          )}
        >
          <CopyIcon className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader icon={Layers2Icon} title="Duplicate Workflow" />
        <div className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive and a unique name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description
                      <p className="text-xs text-muted-foreground">
                        (optional)
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what your workflow does.
                      <br /> This is Optional but it can help you remember the
                      workflow &apos;s purpose.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && "Proceed"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DuplicateWorkflowDialog;
