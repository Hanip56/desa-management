import Header from "@/app/(dashboard)/components/header";
import { SkPenghasilanOrangTuaClient } from "./components/sk-penghasilan-orang-tua-client";

const SkPenghasilanOrangTuaPage = () => {
  return (
    <main>
      <Header title={`Pengajuan SK Penghasilan Orang Tua`} withBreadcrumb />

      <SkPenghasilanOrangTuaClient />
    </main>
  );
};

export default SkPenghasilanOrangTuaPage;
