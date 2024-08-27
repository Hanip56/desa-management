"use client";

import Header from "../components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ListSetting from "../components/list-setting";
import { useRouter } from "next/navigation";

const Pengajuan = () => {
  const router = useRouter();
  const lists = [
    {
      label: "Surat kelahiran",
      href: "/pengajuan/surat-kelahiran",
    },
    {
      label: "Surat kematian",
      href: "/pengajuan/surat-kematian",
    },
    {
      label: "SK belum menikah",
      href: "/pengajuan/sk-belum-menikah",
    },
    {
      label: "SK ijin keramaian",
      href: "/pengajuan/sk-ijin-keramaian",
    },
    {
      label: "SK penghasilan orang tua",
      href: "/pengajuan/sk-penghasilan-orang-tua",
    },
  ];

  return (
    <main>
      <Header
        title="Pengajuan"
        subtitle="Aplikasi pengelolaan desa Margaasih"
      />

      <Card className="mt-8 rounded-2xl">
        <CardHeader className="flex flex-col md:flex-row items-center md:justify-between gap-y-2">
          <CardTitle className="text-xl">Daftar Pengajuan</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {lists.map((list) => (
              <ListSetting
                key={list.href}
                label={list.label}
                value={`Pengajuan ${list.label}`}
                actionLabel="+"
                action={() => router.push(list.href)}
              />
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
};

export default Pengajuan;
