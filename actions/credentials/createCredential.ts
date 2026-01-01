"use server";

<<<<<<< HEAD
import { symmetricEncrypt } from "@/lib/encryption";
=======
>>>>>>> 9244f1b374c3764fc445c5f7662219e925d47451
import { prisma } from "@/lib/prisma";
import {
  createCredentialsSchema,
  createCredentialsSchemaType,
} from "@/schema/credentials";

import { auth } from "@clerk/nextjs/server";
<<<<<<< HEAD
import { revalidatePath } from "next/cache";
=======
import { redirect } from "next/navigation";
>>>>>>> 9244f1b374c3764fc445c5f7662219e925d47451

export async function CreateCredentials(form: createCredentialsSchemaType) {
  const { success, data } = createCredentialsSchema.safeParse(form);
  if (!success) throw new Error("Invaid Form Data");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
<<<<<<< HEAD
  const encryptedValue = symmetricEncrypt(data.value);

=======
  const encryptedValue = symmmetricEncrypt(data.value);
>>>>>>> 9244f1b374c3764fc445c5f7662219e925d47451
  const result = await prisma.credentials.create({
    data: {
      userId,
      name: data.name,
<<<<<<< HEAD
      value: encryptedValue,
    },
  });
  if (!result) throw new Error("failed to create credential ");
  revalidatePath("/credentials");
=======
      value: data.value,
    },
  });
  if (!result) throw new Error("failed to create credential ");
  //   redirect(`/workflow/editor/${result.id}`);
>>>>>>> 9244f1b374c3764fc445c5f7662219e925d47451
}
