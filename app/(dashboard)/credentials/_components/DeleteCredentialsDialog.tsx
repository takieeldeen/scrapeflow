"use client";

import { deleteCredentials } from "@/actions/credentials/deleteCredential";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Credentials } from "@/lib/generated/prisma/client";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface props {
  credentials: Credentials;
}
export default function DeleteCredentialsDialog({ credentials }: props) {
  const [open, setOpen] = useState<boolean>(false);
  const [confirmationText, setConfirmationText] = useState<string>("");
  const { mutate, isPending } = useMutation({
    mutationFn: deleteCredentials,
    onSuccess: () =>
      toast.success("Credentials Deleted Succesfully", { id: credentials.id }),
    onError: () =>
      toast.error("Something went wrong while deleting the credentials", {
        id: credentials.id,
      }),
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"icon"}>
          <XIcon size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you deleted this credentials you will not be able to recover it.
            <div className="flex flex-col py-4 gap-2">
              <p>
                If you are sure, enter <b>{credentials?.name}</b> inside the
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
              disabled={confirmationText !== credentials.name || isPending}
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                mutate(credentials.id);
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
