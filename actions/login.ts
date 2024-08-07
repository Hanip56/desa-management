"use server";

import { signIn } from "@/auth";
import { masukSchema } from "@/schemas";
import { redirect } from "next/navigation";
import { z } from "zod";

const login = async (values: z.infer<typeof masukSchema>) => {
  const validateFields = masukSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalidate fields" };
  }

  const { email, password } = validateFields.data;
  try {
    const resSignIn = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: "Signed In" };
  } catch (error) {
    const err = (error as any)?.cause?.err?.message;
    if (err) {
      return { error: err };
    }
    return { error: "Something went wrong" };
  }
};

export default login;
