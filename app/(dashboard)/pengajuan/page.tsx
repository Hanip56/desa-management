import Header from "../components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PengajuanClient from "./components/pengajuan-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Pengajuan = async () => {
  const session = await auth();

  if (session?.user.role === "USER") {
    redirect("/");
  }

  return (
    <main>
      <Header title="Pengajuan" withBreadcrumb />

      <Card className="mt-8 rounded-2xl">
        <CardHeader className="flex flex-col md:flex-row items-center md:justify-between gap-y-2">
          <CardTitle className="text-xl">Daftar Pengajuan</CardTitle>
        </CardHeader>
        <CardContent>
          <PengajuanClient />
        </CardContent>
      </Card>
    </main>
  );
};

export default Pengajuan;
