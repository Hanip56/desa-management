import { Skeleton } from "@/components/ui/skeleton";
import { DataCardLoading } from "./data-card";
import { DataGrid } from "./data-grid";
import LatestPengajuan, { LatestPengajuanSkeleton } from "./latest-pengajuan";
import PengajuanChart from "./pengajuan-chart";
import prisma from "@/db/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Suspense } from "react";

export default async function MainDashboard() {
  const suratKelahiranMasuk = await prisma.suratKelahiran.count();
  const suratKematianMasuk = await prisma.suratKematian.count();
  const skBelumMenikahMasuk = await prisma.skBelumMenikah.count();
  const skPenghasilanOrangTuaMasuk = await prisma.skPenghasilanOrangTua.count();
  const skIjinKeramaianMasuk = await prisma.skIjinKeramaian.count();

  const suratKelahiranDiterima = await prisma.suratKelahiran.count({
    where: { status: "DITERIMA" },
  });
  const suratKematianDiterima = await prisma.suratKematian.count({
    where: { status: "DITERIMA" },
  });
  const skBelumMenikahDiterima = await prisma.skBelumMenikah.count({
    where: { status: "DITERIMA" },
  });
  const skPenghasilanOrangTuaDiterima =
    await prisma.skPenghasilanOrangTua.count({
      where: { status: "DITERIMA" },
    });
  const skIjinKeramaianDiterima = await prisma.skIjinKeramaian.count({
    where: { status: "DITERIMA" },
  });

  const suratKelahiranDitolak = await prisma.suratKelahiran.count({
    where: { status: "DITOLAK" },
  });
  const suratKematianDitolak = await prisma.suratKematian.count({
    where: { status: "DITOLAK" },
  });
  const skBelumMenikahDitolak = await prisma.skBelumMenikah.count({
    where: { status: "DITOLAK" },
  });
  const skPenghasilanOrangTuaDitolak = await prisma.skPenghasilanOrangTua.count(
    {
      where: { status: "DITOLAK" },
    }
  );
  const skIjinKeramaianDitolak = await prisma.skIjinKeramaian.count({
    where: { status: "DITOLAK" },
  });

  const jumlahSuratMasuk =
    suratKelahiranMasuk +
    suratKematianMasuk +
    skBelumMenikahMasuk +
    skPenghasilanOrangTuaMasuk +
    skIjinKeramaianMasuk;
  const jumlahSuratDiterima =
    suratKelahiranDiterima +
    suratKematianDiterima +
    skBelumMenikahDiterima +
    skPenghasilanOrangTuaDiterima +
    skIjinKeramaianDiterima;
  const jumlahSuratDitolak =
    suratKelahiranDitolak +
    suratKematianDitolak +
    skBelumMenikahDitolak +
    skPenghasilanOrangTuaDitolak +
    skIjinKeramaianDitolak;

  return (
    <>
      <div className="-mt-8">
        <DataGrid
          data1={jumlahSuratMasuk}
          data2={jumlahSuratDiterima}
          data3={jumlahSuratDitolak}
        />
      </div>

      <div className="w-full flex items-start flex-col md:flex-row gap-4">
        <div className="w-full flex-1 h-full">
          <Suspense fallback={<LatestPengajuanSkeleton />}>
            <LatestPengajuan />
          </Suspense>
        </div>
        <div className="w-full md:w-80 h-full">
          <PengajuanChart
            suratKelahiranCount={suratKelahiranMasuk}
            skBelumMenikahCount={skBelumMenikahMasuk}
            skIjinKeramaianCount={skIjinKeramaianMasuk}
            skPenghasilanOrangTuaCount={skPenghasilanOrangTuaMasuk}
            suratKematianCount={suratKematianMasuk}
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
