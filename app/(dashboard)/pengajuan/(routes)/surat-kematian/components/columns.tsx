"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import CellAction from "./cell-action";
import StatusBadge from "@/app/(dashboard)/components/status-badge";
import { formatDate } from "@/lib/utils";

export type ColumnsType = {
  id: string;
  nama: string;
  alamat: string;
  jenisKelamin: "L" | "P";
  status: "DIPROSES" | "DITERIMA" | "DITOLAK";
  updatedAt: Date;
};

export const columns = (toggleSortDate: () => void) => {
  const columns: ColumnDef<ColumnsType>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.id.slice(0, 5) + "..."}</div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full px-0"
            onClick={toggleSortDate}
          >
            Terakhir diperbarui
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex justify-center text-center">
            {formatDate(row.original.updatedAt)}
          </div>
        );
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
      header: () => (
        <div className="flex items-center justify-center text-center">
          Jenis kelamin
        </div>
      ),
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
