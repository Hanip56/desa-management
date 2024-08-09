import Header from "@/app/(dashboard)/components/header";
import { SuratKelahiranClient } from "./components/surat-kelahiran-client";

const SuratKelahiranPage = () => {
  return (
    <main>
      <Header title="Pengajuan Surat Kelahiran" withBreadcrumb />

      <SuratKelahiranClient />
    </main>
  );
};

export default SuratKelahiranPage;
