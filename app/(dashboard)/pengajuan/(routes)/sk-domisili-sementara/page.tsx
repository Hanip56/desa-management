import Header from "@/app/(dashboard)/components/header";
import { SkDomisiliSementaraClient } from "./components/sk-domisili-sementara-client";

const SkDomisiliSementaraPage = () => {
  return (
    <main>
      <Header title="Pengajuan SK Domisili Sementara" withBreadcrumb />

      <SkDomisiliSementaraClient />
    </main>
  );
};

export default SkDomisiliSementaraPage;
