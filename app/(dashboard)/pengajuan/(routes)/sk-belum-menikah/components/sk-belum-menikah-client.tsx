"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { columns, ColumnsType } from "./columns";
import { DataTable } from "@/components/data-table";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAllSkBelumMenikah } from "@/fetcher/sk-belum-menikah-fetcher";
import CardSkeleton from "@/app/(dashboard)/components/card-skeleton";
import { useNavigate } from "@/hooks/use-navigate";
import CardError from "@/app/(dashboard)/components/card-error";

export const SkBelumMenikahClient = () => {
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
    queryKey: ["sk-belum-menikahs", { page, search, status, updatedAt }],
    queryFn: () =>
      getAllSkBelumMenikah({
        page,
        limit: 8,
        search,
        status,
        updatedAt,
      }),
    placeholderData: (prev) => prev,
  });

  if (query.isLoading || query.isPending) return <CardSkeleton />;
  if (query.isError) return <CardError error={query?.error?.message} />;

  const data: ColumnsType[] = query.data.data.map((surat) => ({
    id: surat.id,
    nama: surat.namaLengkap,
    alamat: surat.alamat,
    jenisKelamin: surat.jenisKelamin,
    status: surat.status,
    updatedAt: surat.updatedAt,
  }));

  return (
    <Card className="mt-8 rounded-2xl">
      <CardHeader className="flex flex-col md:flex-row items-center md:justify-between gap-y-2">
        <div className="text-center md:text-start">
          <CardTitle className="text-xl">Daftar Pengajuan</CardTitle>
        </div>
        <Button asChild className="w-full md:w-fit">
          <Link href="sk-belum-menikah/formulir">
            <Plus className="w-5 h-5 mr-2 " /> Buat pengajuan
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns(toggleSortDate)}
          data={data}
          filterKey="nama"
          onDelete={() => {}}
          limit={query.data.limit}
          totalPages={query.data.total_pages}
          totalItems={query.data.total_items}
          page={page}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          search={search}
          handleSearch={handleSearch}
          handleFilterStatus={handleFilterStatus}
        />
      </CardContent>
    </Card>
  );
};
