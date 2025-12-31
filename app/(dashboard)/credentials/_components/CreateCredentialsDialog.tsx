"use client";

import CustomDialogHeader from "@/components/customDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, ShieldEllipsis } from "lucide-react";
import { useCallback, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCredentialsSchema,
  createCredentialsSchemaType,
} from "@/schema/credentials";
import { CreateCredentials } from "@/actions/credentials/createCredential";

function CreateCredentialsDialog({ triggerText }: { triggerText?: string }) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<createCredentialsSchemaType>({
    resolver: zodResolver(createCredentialsSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredentials,
    onSuccess: () => {
      toast.success("Credentials created", { id: "create-credentials" });
    },
    onError: () => {
      toast.success("Failed to create credentials", {
        id: "create-credentials",
      });
    },
  });
  const onSubmit = useCallback(
    (values: createCredentialsSchemaType) => {
      toast.loading("Creating Credentials...", { id: "create-credentials" });
      mutate(values);
    },
    [mutate]
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
        <Button>{triggerText ?? "Create"}</Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader icon={ShieldEllipsis} title="Create Credentials" />
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
                      Enter a descriptive unique name for the credentials
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Value
                      <p className="text-xs text-muted-foreground">
                        <p className="text-xs text-primary">(required)</p>
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Value" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the value associated with this credential <br />{" "}
                      This value will be securely encrypted and stored
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

export default CreateCredentialsDialog;
