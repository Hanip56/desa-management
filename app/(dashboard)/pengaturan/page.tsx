import { auth } from "@/auth";
import Header from "../components/header";
import PengaturanClient from "./components/pengaturan-client";
import { redirect } from "next/navigation";

const Pengaturan = async () => {
  const session = await auth();

  if (session?.user.role === "USER") {
    redirect("/");
  }

  return (
    <main>
      <Header title="Pengaturan" subtitle="lorem ipsum dolor sit amet" />

      <PengaturanClient />
    </main>
  );
};

export default Pengaturan;
