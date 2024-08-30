import Header from "@/app/(dashboard)/components/header";
import { SkUsahaClient } from "./components/sk-usaha-client";

const SkUsahaPage = () => {
  return (
    <main>
      <Header title="Pengajuan SK Usaha" withBreadcrumb />

      <SkUsahaClient />
    </main>
  );
};

export default SkUsahaPage;
