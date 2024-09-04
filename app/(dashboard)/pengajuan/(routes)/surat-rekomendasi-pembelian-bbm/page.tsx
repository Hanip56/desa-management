import Header from "@/app/(dashboard)/components/header";
import { SuratRekomendasiPembelianBbmClient } from "./components/surat-rekomendasi-pembelian-client";

const SuratRekomendasiPembelianBbmPage = () => {
  return (
    <main>
      <Header
        title="Pengajuan Surat Rekomendasi pembelian BBM"
        withBreadcrumb
      />

      <SuratRekomendasiPembelianBbmClient />
    </main>
  );
};

export default SuratRekomendasiPembelianBbmPage;
