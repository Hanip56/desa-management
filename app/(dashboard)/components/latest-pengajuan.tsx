import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableSimple } from "@/components/ui/data-table-simple";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/db/prisma";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

type Info = {
  id: string;
  jenis: string;
  tanggal: string;
};

export const latestPengajuanColumn: ColumnDef<Info>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "jenis",
    header: "Jenis",
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
  },
];

const LatestPengajuan = async () => {
  const latestRecords: any = await prisma.$queryRaw`
  SELECT * FROM (
    SELECT id,'Surat kelahiran' as jenis, "createdAt" FROM "SuratKelahiran"
    UNION ALL
    SELECT id,'Surat kematian' as jenis, "createdAt" FROM "SuratKematian"
    UNION ALL
    SELECT id,'Sk ijin keramain' as jenis, "createdAt" FROM "SkIjinKeramaian"
    UNION ALL
    SELECT id,'Sk belum menikah' as jenis, "createdAt" FROM "SkBelumMenikah"
    UNION ALL
    SELECT id,'Sk penghasilan orang tua' as jenis, "createdAt" FROM "SkPenghasilanOrangTua"
  ) AS combined
  ORDER BY combined."createdAt" DESC
  LIMIT 5;
`;

  if (!latestRecords)
    return <p className="text-rose-700 font-semibold">Something went wrong</p>;

  const data = latestRecords.map((d: any) => ({
    id: d.id,
    jenis: d.jenis,
    tanggal: formatDate(d.createdAt as Date),
  }));

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Pengajuan terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTableSimple columns={latestPengajuanColumn} data={data} />
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
