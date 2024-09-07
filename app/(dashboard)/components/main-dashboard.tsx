import { Skeleton } from "@/components/ui/skeleton";
import { DataCardLoading } from "./data-card";
import { DataGrid } from "./data-grid";
import LatestPengajuan, { LatestPengajuanSkeleton } from "./latest-pengajuan";
import PengajuanChart from "./pengajuan-chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Suspense } from "react";
import { getCountedPengajuan } from "@/lib/server-utils";

export default async function MainDashboard() {
  const {
    total,
    totalDiproses,
    totalDiterima,

    suratKelahiranCount,
    suratKematianCount,
    skBelumMenikahCount,
    skIjinKeramaianCount,
    skPenghasilanOrangTuaCount,
    skIzinBekerjaCount,
    skBelumMemilikiRumahCount,
    skTidakMemilikiPekerjaanCount,
    skUsahaCount,
    skDomisiliLembagaCount,
    skDomisiliImigrasiCount,
    skDomisiliSementaraCount,
    skTidakMampuCount,
    suratRekomendasiPembelianBbmCount,
    pendaftaranPindahWniCount,
  } = await getCountedPengajuan();

  console.log({ total, totalDiproses, totalDiterima });

  return (
    <>
      <div className="-mt-8">
        <DataGrid data1={total} data2={totalDiproses} data3={totalDiterima} />
      </div>

      <div className="w-full flex items-start flex-col md:flex-row gap-4">
        <div className="w-full flex-1 h-full">
          <Suspense fallback={<LatestPengajuanSkeleton />}>
            <LatestPengajuan />
          </Suspense>
        </div>
        <div className="w-full md:w-80 h-full">
          <PengajuanChart
            suratKelahiranCount={suratKelahiranCount}
            suratKematianCount={suratKematianCount}
            skBelumMenikahCount={skBelumMenikahCount}
            skIjinKeramaianCount={skIjinKeramaianCount}
            skPenghasilanOrangTuaCount={skPenghasilanOrangTuaCount}
            skIzinBekerjaCount={skIzinBekerjaCount}
            skBelumMemilikiRumahCount={skBelumMemilikiRumahCount}
            skTidakMemilikiPekerjaanCount={skTidakMemilikiPekerjaanCount}
            skUsahaCount={skUsahaCount}
            skDomisiliLembagaCount={skDomisiliLembagaCount}
            skDomisiliImigrasiCount={skDomisiliImigrasiCount}
            skDomisiliSementaraCount={skDomisiliSementaraCount}
            skTidakMampuCount={skTidakMampuCount}
            suratRekomendasiPembelianBbmCount={
              suratRekomendasiPembelianBbmCount
            }
            pendaftaranPindahWniCount={pendaftaranPindahWniCount}
          />
        </div>
      </div>
    </>
  );
}

export const MainDashboardSkeleton = () => (
  <div className="-mt-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCardLoading />
      <DataCardLoading />
      <DataCardLoading />
    </div>
    <div className="w-full flex items-start flex-col md:flex-row gap-4">
      <LatestPengajuanSkeleton />
      <div className="w-full md:w-80">
        <Card className="w-full flex flex-col h-[22rem]">
          <CardHeader className="items-center">
            <Skeleton className="h-10 w-[80%] max-w-60 mb-4" />
            <Skeleton className="h-4 w-[60%] max-w-40" />
          </CardHeader>
          <CardContent className="flex-1 pb-0 h-full"></CardContent>
        </Card>
      </div>
    </div>
  </div>
);
