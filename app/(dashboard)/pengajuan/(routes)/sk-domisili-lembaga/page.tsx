import Header from "@/app/(dashboard)/components/header";
import { SkDomisiliLembagaClient } from "./components/sk-domisili-lembaga-client";

const SkDomisiliLembagaPage = () => {
  return (
    <main>
      <Header title="Pengajuan SK Domisili Lembaga" withBreadcrumb />

      <SkDomisiliLembagaClient />
    </main>
  );
};

export default SkDomisiliLembagaPage;
