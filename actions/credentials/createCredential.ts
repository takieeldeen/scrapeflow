"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import {
  createCredentialsSchema,
  createCredentialsSchemaType,
} from "@/schema/credentials";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function CreateCredentials(form: createCredentialsSchemaType) {
  const { success, data } = createCredentialsSchema.safeParse(form);
  if (!success) throw new Error("Invaid Form Data");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  const encryptedValue = symmetricEncrypt(data.value);

  const result = await prisma.credentials.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue,
    },
  });
  if (!result) throw new Error("failed to create credential ");
  revalidatePath("/credentials");
}
