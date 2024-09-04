import Header from "@/app/(dashboard)/components/header";
import ListsPersyaratan from "@/app/(dashboard)/components/lists-persyaratan";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PersyaratanMutasiPage = () => {
  return (
    <main>
      <Header title="Persyaratan Mutasi" withBreadcrumb />

      <Card className="mt-8 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Daftar Persyaratan</CardTitle>
        </CardHeader>
        <CardContent className="sm:px-10">
          <ListsPersyaratan
            lists={[
              "Fotocopy KTP",
              "Fotocopy KK",
              "Fotocopy Sertifikat / FC AJB (legalisir)",
              "Fotocopy SPPT yang mau di mutasi kan",
              "Surat keterangan kepala desa di TTD kepala desa yang menerangkan untuk Mutasi SPPT PBB",
              "Materai 10.000",
            ]}
          />
        </CardContent>
        <CardFooter className="flex items-center justify-center text-center">
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            Catatan: untuk melakukan pengajuan silahkan kunjungi kantor desa
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default PersyaratanMutasiPage;
