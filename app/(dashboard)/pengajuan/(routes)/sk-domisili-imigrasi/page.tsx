import Header from "@/app/(dashboard)/components/header";
import { SkDomisiliImigrasiClient } from "./components/sk-domisili-imigrasi-client";

const SkDomisiliImigrasiPage = () => {
  return (
    <main>
      <Header title="Pengajuan SK Domisili Imigrasi" withBreadcrumb />

      <SkDomisiliImigrasiClient />
    </main>
  );
};

export default SkDomisiliImigrasiPage;
