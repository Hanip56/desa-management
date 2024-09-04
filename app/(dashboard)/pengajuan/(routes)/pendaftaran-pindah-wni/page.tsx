import Header from "@/app/(dashboard)/components/header";
import { PendaftaranPindahWniClient } from "./components/pendaftaran-pindah-wni-client";

const PendaftaranPindahWniPage = () => {
  return (
    <main>
      <Header title="Pengajuan Pendaftaran Pindah WNI" withBreadcrumb />

      <PendaftaranPindahWniClient />
    </main>
  );
};

export default PendaftaranPindahWniPage;
