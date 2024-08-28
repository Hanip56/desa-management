"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Printer } from "lucide-react";
import { columns, ColumnsType } from "./columns";
import { DataTable } from "@/components/data-table";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAllSkIjinKeramaian } from "@/fetcher/sk-ijin-keramaian-fetcher";
import CardSkeleton from "@/app/(dashboard)/components/card-skeleton";
import { useNavigate } from "@/hooks/use-navigate";
import CardError from "@/app/(dashboard)/components/card-error";
import { useReactToPrint } from "react-to-print";
import { getAlamat } from "@/lib/utils";

export const SkIjinKeramaianClient = () => {
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
    limit,
  ] = useNavigate();

  const printableRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    bodyClass: "p-6",
  });

  const query = useQuery({
    queryKey: ["sk-ijin-keramaians", { page, search, status, updatedAt }],
    queryFn: () =>
      getAllSkIjinKeramaian({
        page,
        limit,
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
    nama: surat.nama,
    alamat: getAlamat(surat.kampung, surat.rt, surat.rw),
    acara: surat.acara,
    status: surat.status,
    updatedAt: surat.updatedAt,
  }));

  return (
    <Card className="mt-8 rounded-2xl">
      <CardHeader className="flex flex-col md:flex-row items-center md:justify-between gap-y-2">
        <div className="text-center md:text-start">
          <CardTitle className="text-xl">Daftar Pengajuan</CardTitle>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            onClick={handlePrint}
            className="bg-sky-500 hover:bg-sky-500/80"
          >
            <Printer className="w-5 h-5" />
          </Button>
          <Button asChild className="w-full md:w-fit">
            <Link href="sk-ijin-keramaian/formulir">
              <Plus className="w-5 h-5 mr-2 " /> Buat pengajuan
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          ref={printableRef}
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
