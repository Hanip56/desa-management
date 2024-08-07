"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableSimple } from "@/components/ui/data-table-simple";
import { formatTanggal } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

type Info = {
  id: string;
  jenis: string;
  email: string;
  tanggal: string;
};
const columns: ColumnDef<Info>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "jenis",
    header: "Jenis",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) => {
      return <p>{formatTanggal(row.original.tanggal)}</p>;
    },
  },
];

const data = [
  {
    id: "1",
    jenis: "Surat kelahiran",
    email: "budi.santoso@example.com",
    tanggal: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    jenis: "Keterangan ijin keramaian",
    email: "andi.pratama@example.com",
    tanggal: "2023-02-20T14:45:00Z",
  },
  {
    id: "3",
    jenis: "Pendaftaran pindah WNI",
    email: "citra.dewi@example.com",
    tanggal: "2023-03-10T09:00:00Z",
  },
  {
    id: "4",
    jenis: "Surat kelahiran",
    email: "dewi.sartika@example.com",
    tanggal: "2023-04-25T12:15:00Z",
  },
  {
    id: "5",
    jenis: "Keterangan ijin keramaian",
    email: "eka.saputra@example.com",
    tanggal: "2023-05-30T16:00:00Z",
  },
];

const LatestPengajuan = () => {
  return (
    <Card className="w-full border-none drop-shadow-md">
      <CardHeader>
        <CardTitle>Pengajuan terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTableSimple columns={columns} data={data} />
      </CardContent>
    </Card>
  );
};

export default LatestPengajuan;
