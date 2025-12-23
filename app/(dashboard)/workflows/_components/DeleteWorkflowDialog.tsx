"use client";

import { deleteWorkflow } from "@/actions/workflows/deleteWorkflow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Workflow } from "@/lib/generated/prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface props {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflow: Workflow;
}
export default function DeleteWorkflowDialog({
  open,
  setOpen,
  workflow,
}: props) {
  const [confirmationText, setConfirmationText] = useState<string>("");
  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () =>
      toast.success("Workflow Deleted Succesfully", { id: workflow.id }),
    onError: () =>
      toast.error("Something went wrong while deleting the workflow", {
        id: workflow.id,
      }),
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you deleted this workflow you will not be able to recover it.
            <div className="flex flex-col py-4 gap-2">
              <p>
                If you are sure, enter <b>{workflow?.name}</b> inside the
                textbox below
              </p>
              <Input
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button
              disabled={confirmationText !== workflow.name || isPending}
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                mutate(workflow.id);
                setConfirmationText("");
              }}
            >
              {!isPending && "Delete"}
              {isPending && <Spinner />}
            </Button>
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={() => {
              setConfirmationText("");
            }}
            disabled={isPending}
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
