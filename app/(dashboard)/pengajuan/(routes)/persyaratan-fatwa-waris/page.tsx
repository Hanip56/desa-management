import Header from "@/app/(dashboard)/components/header";
import ListsPersyaratan from "@/app/(dashboard)/components/lists-persyaratan";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PersyaratanFatwaWarisPage = () => {
  return (
    <main>
      <Header title="Persyaratan Fatwa waris" withBreadcrumb />

      <Card className="mt-8 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Daftar Persyaratan</CardTitle>
        </CardHeader>
        <CardContent className="sm:px-10">
          <ListsPersyaratan
            lists={[
              "Fotocopy KTP & KK Alm",
              "Fotocopy Surat kematian",
              "Fotocopy Surat nikah Alm",
              "Fotocopy KK & KTP semua ahli waris",
              "Fotocopy KTP 2 orang saksi",
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

export default PersyaratanFatwaWarisPage;
