import { auth } from "@/auth";
import Header from "../components/header";
import PenggunaClient from "./components/pengguna-client";
import { redirect } from "next/navigation";

const Pengguna = async () => {
  const session = await auth();

  if (session?.user.role === "USER") {
    redirect("/");
  }

  return (
    <main>
      <Header title="Pengguna" subtitle="lorem ipsum dolor sit amet" />

      <PenggunaClient />
    </main>
  );
};

export default Pengguna;
