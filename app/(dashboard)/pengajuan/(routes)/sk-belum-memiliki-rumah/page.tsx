import Header from "@/app/(dashboard)/components/header";
import { SkBelumMemilikiRumahClient } from "./components/sk-belum-memiliki-rumah-client";

const SkBelumMemilikiRumahPage = () => {
  return (
    <main>
      <Header title="Pengajuan SK Belum Memiliki Rumah" withBreadcrumb />

      <SkBelumMemilikiRumahClient />
    </main>
  );
};

export default SkBelumMemilikiRumahPage;
