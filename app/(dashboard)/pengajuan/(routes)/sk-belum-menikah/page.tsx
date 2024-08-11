import Header from "@/app/(dashboard)/components/header";
import { SkBelumMenikahClient } from "./components/sk-belum-menikah-client";

const SkBelumMenikahPage = () => {
  return (
    <main>
      <Header title="Pengajuan SK Belum Menikah" withBreadcrumb />

      <SkBelumMenikahClient />
    </main>
  );
};

export default SkBelumMenikahPage;
