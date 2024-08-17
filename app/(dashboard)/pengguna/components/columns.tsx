"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { formatDate } from "@/lib/utils";
import CellAction from "./cell-action";

export type ColumnsType = {
  id: string;
  username: string;
  email: string;
  updatedAt: Date;
  role: string;
};

export const columns = (toggleSortDate: () => void) => {
  const columns: ColumnDef<ColumnsType>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => <div className="text-center">{row.original.id}</div>,
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
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    // {
    //   id: "actions",
    //   header: "",
    //   cell: ({ row }) => <CellAction data={row.original} />,
    // },
  ];

  return columns;
};
