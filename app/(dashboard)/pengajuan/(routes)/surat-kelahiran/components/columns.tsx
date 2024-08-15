"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import CellAction from "./cell-action";
import StatusBadge from "@/app/(dashboard)/components/status-badge";
import { formatDate } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SuratKelahiranType = {
  id: string;
  nama: string;
  alamat: string;
  jenisKelamin: "L" | "P";
  status: "DIPROSES" | "DITERIMA" | "DITOLAK";
  updatedAt: string;
};

export const columns = (toggleSortDate: () => void) => {
  const columns: ColumnDef<SuratKelahiranType>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.id.slice(0, 5) + "..."}</div>
        // <div >{row.index + 1}</div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return (
          <Button variant="ghost" className="w-full" onClick={toggleSortDate}>
            Terakhir diperbarui
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <>{formatDate(row.original.updatedAt)}</>;
      },
    },
    {
      accessorKey: "nama",
      header: "Nama",
    },
    {
      accessorKey: "alamat",
      header: "Alamat",
    },
    {
      accessorKey: "jenisKelamin",
      header: "Jenis kelamin",
      cell: ({ row }) => (
        <p className="text-center">{row.original.jenisKelamin}</p>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="flex items-center justify-center">Status</div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <StatusBadge status={row.original.status} />
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <CellAction data={row.original} />,
    },
  ];

  return columns;
};
