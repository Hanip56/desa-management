import { auth } from "@/auth";
import Header from "../components/header";
import ProfilClient from "./components/profil-client";
import { redirect } from "next/navigation";
import { getSignedUrl } from "@/lib/server-utils";

const Profil = async () => {
  const session = await auth();

  if (
    session?.user.role === "USER" &&
    (!session.user.ktpUrl || !session.user.kkUrl)
  ) {
    return redirect("/");
  }

  const ktpUrl = session?.user.ktpUrl
    ? getSignedUrl(session.user.ktpUrl)
    : undefined;

  const kkUrl = session?.user.kkUrl
    ? getSignedUrl(session.user.kkUrl)
    : undefined;

  return (
    <main>
      <Header title="Profil" withBreadcrumb />

      <ProfilClient ktpUrl={ktpUrl} kkUrl={kkUrl} />
    </main>
  );
};

export default Profil;
