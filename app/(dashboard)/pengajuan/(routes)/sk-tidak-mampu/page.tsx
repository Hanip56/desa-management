import Header from "@/app/(dashboard)/components/header";
import { SkTidakMampuClient } from "./components/sk-tidak-mampu-client";

const SkTidakMampuPage = () => {
  return (
    <main>
      <Header title="Pengajuan SK Tidak Mampu" withBreadcrumb />

      <SkTidakMampuClient />
    </main>
  );
};

export default SkTidakMampuPage;
