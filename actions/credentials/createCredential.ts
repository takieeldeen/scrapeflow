"use server";

import { prisma } from "@/lib/prisma";
import {
  createCredentialsSchema,
  createCredentialsSchemaType,
} from "@/schema/credentials";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCredentials(form: createCredentialsSchemaType) {
  const { success, data } = createCredentialsSchema.safeParse(form);
  if (!success) throw new Error("Invaid Form Data");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  const encryptedValue = symmmetricEncrypt(data.value);
  const result = await prisma.credentials.create({
    data: {
      userId,
      name: data.name,
      value: data.value,
    },
  });
  if (!result) throw new Error("failed to create credential ");
  //   redirect(`/workflow/editor/${result.id}`);
}
