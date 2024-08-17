"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUsers } from "@/fetcher/user-fetcher";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import CardSkeleton from "../../components/card-skeleton";
import CardError from "../../components/card-error";
import { columns, ColumnsType } from "./columns";
import { DataTable } from "@/components/data-table";
import { useNavigate } from "@/hooks/use-navigate";

const PenggunaClient = () => {
  const [
    page,
    handleNext,
    handlePrevious,
    search,
    handleSearch,
    status,
    handleFilterStatus,
    updatedAt,
    toggleSortDate,
  ] = useNavigate();

  const query = useQuery({
    queryKey: ["users", { page, search, updatedAt }],
    queryFn: () =>
      getAllUsers({
        page,
        limit: 8,
        search,
        updatedAt,
      }),
    placeholderData: (prev) => prev,
  });

  if (query.isLoading || query.isPending) return <CardSkeleton />;
  if (query.isError) return <CardError error={query?.error?.message} />;

  console.log({ data: query.data });

  const data: ColumnsType[] = query.data.data.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    updatedAt: user.updatedAt,
    role: user.role,
  }));

  return (
    <Card className="mt-8 rounded-2xl">
      <CardHeader className="flex flex-col md:flex-row items-center md:justify-between gap-y-2">
        <div className="text-center md:text-start">
          <CardTitle className="text-xl">Daftar Pengguna</CardTitle>
        </div>
        {/* <Button asChild className="w-full md:w-fit">
          <Link href="surat-kematian/formulir">
            <Plus className="w-5 h-5 mr-2 " /> Buat pengguna
          </Link>
        </Button> */}
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns(toggleSortDate)}
          data={data}
          filterKey="ID"
          onDelete={() => {}}
          limit={query.data.limit}
          totalPages={query.data.total_pages}
          totalItems={query.data.total_items}
          page={page}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          search={search}
          handleSearch={handleSearch}
        />
      </CardContent>
    </Card>
  );
};

export default PenggunaClient;
