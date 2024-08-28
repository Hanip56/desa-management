import Header from "@/app/(dashboard)/components/header";
import { SkIzinBekerjaClient } from "./components/sk-izin-bekerja-client";

const SkIzinBekerjaPage = () => {
  return (
    <main>
      <Header title={`Pengajuan SK Izin Bekerja`} withBreadcrumb />

      <SkIzinBekerjaClient />
    </main>
  );
};

export default SkIzinBekerjaPage;
