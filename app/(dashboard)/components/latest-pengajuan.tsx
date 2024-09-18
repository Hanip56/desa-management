import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/db/prisma";
import { formatDate } from "@/lib/utils";
import LatestPengajuanClient from "./latest-pengajuan-client";

const LatestPengajuan = async () => {
  const latestRecords: any = await prisma.$queryRaw`
  SELECT * FROM (
    SELECT id,'Surat kelahiran' as jenis, "status", "createdAt" FROM "SuratKelahiran"
    UNION ALL
    SELECT id,'Surat kematian' as jenis, "status", "createdAt" FROM "SuratKematian"
    UNION ALL
    SELECT id,'Sk ijin keramaian' as jenis, "status", "createdAt" FROM "SkIjinKeramaian"
    UNION ALL
    SELECT id,'Sk belum menikah' as jenis, "status", "createdAt" FROM "SkBelumMenikah"
    UNION ALL
    SELECT id,'Sk penghasilan orang tua' as jenis, "status", "createdAt" FROM "SkPenghasilanOrangTua"
    UNION ALL
    SELECT id,'Sk izin bekerja' as jenis, "status", "createdAt" FROM "SkIzinBekerja"
    UNION ALL
    SELECT id,'Sk belum memiliki rumah' as jenis, "status", "createdAt" FROM "SkBelumMemilikiRumah"
    UNION ALL
    SELECT id,'Sk tidak memiliki pekerjaan' as jenis, "status", "createdAt" FROM "SkTidakMemilikiPekerjaan"
    UNION ALL
    SELECT id,'Sk usaha' as jenis, "status", "createdAt" FROM "SkUsaha"
    UNION ALL
    SELECT id,'Sk domisili lembaga' as jenis, "status", "createdAt" FROM "SkDomisiliLembaga"
    UNION ALL
    SELECT id,'Sk domisili imigrasi' as jenis, "status", "createdAt" FROM "SkDomisiliImigrasi"
    UNION ALL
    SELECT id,'Sk domisili sementara' as jenis, "status", "createdAt" FROM "SkDomisiliSementara"
    UNION ALL
    SELECT id,'Sk tidak mampu' as jenis, "status", "createdAt" FROM "SkTidakMampu"
    UNION ALL
    SELECT id,'Surat rekomendasi pembelian bbm' as jenis, "status", "createdAt" FROM "SuratRekomendasiPembelianBbm"
    UNION ALL
    SELECT id,'Pendaftaran pindah wni' as jenis, "status", "createdAt" FROM "PendaftaranPindahWni"
  ) AS combined
  ORDER BY combined."createdAt" DESC
  LIMIT 5;
`;

  if (!latestRecords)
    return <p className="text-rose-700 font-semibold">Something went wrong</p>;

  const data = latestRecords.map((d: any) => ({
    id: d.id,
    jenis: d.jenis,
    status: d.status,
    tanggal: formatDate(d.createdAt as Date),
    link: `/pengajuan/${d.jenis.toLowerCase().replace(/\s/g, "-")}/${d.id}`,
  }));

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Pengajuan terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <LatestPengajuanClient data={data} />
      </CardContent>
    </Card>
  );
};

export default LatestPengajuan;

export const LatestPengajuanSkeleton = () => (
  <div className="w-full flex-1 h-full">
    <Card>
      <CardHeader>
        <Skeleton className="w-60 h-10" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-60" />
      </CardContent>
    </Card>
  </div>
);
