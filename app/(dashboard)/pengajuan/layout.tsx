import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const PengajuanLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (
    session?.user.role === "USER" &&
    (!session.user.ktpUrl || !session.user.kkUrl)
  ) {
    redirect("/");
  }

  return <>{children}</>;
};

export default PengajuanLayout;
