import Header from "@/app/(dashboard)/components/header";
import { SuratKematianClient } from "./components/surat-kematian-client";

const SuratKematianPage = () => {
  return (
    <main>
      <Header title="Pengajuan Surat Kematian" withBreadcrumb />

      <SuratKematianClient />
    </main>
  );
};

export default SuratKematianPage;
