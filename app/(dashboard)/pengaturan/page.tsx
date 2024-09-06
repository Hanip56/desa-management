import { auth } from "@/auth";
import Header from "../components/header";
import PengaturanClient from "./components/pengaturan-client";
import { redirect } from "next/navigation";
import prisma from "@/db/prisma";
import { Setting } from "@prisma/client";

export type SettingClient = Omit<Setting, "tte"> & {
  tte: string | undefined;
};

const Pengaturan = async () => {
  const session = await auth();

  if (session?.user.role === "USER") {
    redirect("/");
  }

  const settingDB = await prisma.setting.findFirst();

  let setting: any = settingDB;

  if (settingDB?.tte) {
    setting.tte = settingDB.tte.toString("base64");
  }

  return (
    <main>
      <Header
        title="Pengaturan"
        subtitle="Aplikasi pengelolaan desa Margaasih"
      />

      <PengaturanClient setting={setting} />
    </main>
  );
};

export default Pengaturan;
