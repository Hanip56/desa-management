import Header from "@/app/(dashboard)/components/header";
import { SkIjinKeramaianClient } from "./components/sk-ijin-keramaian-client";

const SkIjinKeramaianPage = () => {
  return (
    <main>
      <Header title="Pengajuan SK Ijin keramaian" withBreadcrumb />

      <SkIjinKeramaianClient />
    </main>
  );
};

export default SkIjinKeramaianPage;
