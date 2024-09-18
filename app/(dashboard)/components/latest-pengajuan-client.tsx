"use client";

import { DataTableSimple } from "@/components/ui/data-table-simple";
import { StatusType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import StatusBadge from "./status-badge";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type ColumnsType = {
  id: string;
  jenis: string;
  status: StatusType;
  tanggal: string;
  link: string;
};

const columnsLatestPengajuan = () => {
  const columns: ColumnDef<ColumnsType>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "jenis",
      header: "Jenis",
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="flex items-center justify-center">Status</div>
      ),
    },
    {
      accessorKey: "tanggal",
      header: "Tanggal",
    },
    {
      accessorKey: "link",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Link href={row.original.link}>
            <Button size="icon" variant="ghost">
              <ChevronRight className="size-5" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return columns;
};

const LatestPengajuanClient = ({ data }: { data: ColumnsType[] }) => {
  return <DataTableSimple columns={columnsLatestPengajuan()} data={data} />;
};

export default LatestPengajuanClient;
