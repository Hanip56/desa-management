import { auth } from "@/auth";
import Header from "../components/header";
import ProfilClient from "./components/profil-client";
import { redirect } from "next/navigation";
import { getUrl } from "@/lib/server-utils";

const Profil = async () => {
  const session = await auth();

  if (
    session?.user.role === "USER" &&
    (!session.user.ktpUrl || !session.user.kkUrl)
  ) {
    return redirect("/");
  }

  const ktpUrl = session?.user.ktpUrl
    ? getUrl(session.user.ktpUrl, "ktp")
    : undefined;

  const kkUrl = session?.user.kkUrl
    ? getUrl(session.user.kkUrl, "kk")
    : undefined;

  return (
    <main>
      <Header title="Profil" withBreadcrumb />

      <ProfilClient ktpUrl={ktpUrl} kkUrl={kkUrl} />
    </main>
  );
};

export default Profil;
