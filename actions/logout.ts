"use server";

import { auth, signOut } from "@/auth";

export const logout = async () => {
  const session = await auth();

  const data = await fetch("http://localhost:5000/api/auth/logout", {
    headers: new Headers({
      Authorization: `Bearer ${session?.accessToken}`,
    }),
  });

  await signOut({
    redirect: false,
  });

  return { success: "Logged out" };
};
