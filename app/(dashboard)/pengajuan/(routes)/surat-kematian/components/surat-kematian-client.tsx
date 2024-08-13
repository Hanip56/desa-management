"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { columns, SuratKematianType } from "./columns";
import { DataTable } from "@/components/data-table";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAllSuratKematian } from "@/fetcher/surat-kematian-fetcher";
import CardSkeleton from "@/app/(dashboard)/components/card-skeleton";
import { useNavigate } from "@/hooks/use-navigate";
import CardError from "@/app/(dashboard)/components/card-error";

export const SuratKematianClient = () => {
  const [page, handleNext, handlePrevious, search, handleSearch] =
    useNavigate();

  const query = useQuery({
    queryKey: ["surat-kematians", { page, search }],
    queryFn: () =>
      getAllSuratKematian({
        page,
        limit: 8,
        search,
      }),
    placeholderData: (prev) => prev,
  });

  if (query.isLoading || query.isPending) return <CardSkeleton />;
  if (query.isError) return <CardError error={query?.error?.message} />;

  const data: SuratKematianType[] = query.data.data.map((surat) => ({
    id: surat.id,
    nama: surat.namaTerkait,
    alamat: surat.alamatTerkait,
    jenisKelamin: surat.jenisKelaminTerkait,
    status: surat.status,
  }));

  return (
    <Card className="mt-8 rounded-2xl">
      <CardHeader className="flex flex-col md:flex-row items-center md:justify-between gap-y-2">
        <div className="text-center md:text-start">
          <CardTitle className="text-xl">Daftar Pengajuan</CardTitle>
        </div>
        <Button asChild className="w-full md:w-fit">
          <Link href="surat-kematian/formulir">
            <Plus className="w-5 h-5 mr-2 " /> Buat pengajuan
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
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
        />
      </CardContent>
    </Card>
  );
};
