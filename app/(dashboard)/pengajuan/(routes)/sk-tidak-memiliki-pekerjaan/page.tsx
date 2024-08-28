import Header from "@/app/(dashboard)/components/header";
import { SkTidakMemilikiPekerjaanClient } from "./components/sk-tidak-memiliki-pekerjaan-client";

const SkTidakMemilikiPekerjaanPage = () => {
  return (
    <main>
      <Header title="Pengajuan SK Tidak Memiliki Pekerjaan" withBreadcrumb />

      <SkTidakMemilikiPekerjaanClient />
    </main>
  );
};

export default SkTidakMemilikiPekerjaanPage;
