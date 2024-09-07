"use client";

import { pengajuanRoutes } from "@/contants";
import ListSetting from "../../components/list-setting";
import { useRouter } from "next/navigation";

const PengajuanClient = () => {
  const router = useRouter();

  return (
    <ul>
      {pengajuanRoutes.map((list) => (
        <ListSetting
          key={list.href}
          label={list.label}
          value={`Pengajuan ${list.label}`}
          actionLabel="+"
          action={() => router.push(list.href)}
        />
      ))}
    </ul>
  );
};

export default PengajuanClient;
