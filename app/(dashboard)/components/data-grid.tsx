"use client";

import { useSearchParams } from "next/navigation";

import { formatDateRange } from "@/lib/utils";
import {
  HiDocumentArrowDown,
  HiDocumentCheck,
  HiDocumentMinus,
} from "react-icons/hi2";
import { DataCard, DataCardLoading } from "./data-card";

export const DataGrid = () => {
  const params = useSearchParams();
  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  //   if (isLoading) {
  //     return (
  //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
  //         <DataCardLoading />
  //         <DataCardLoading />
  //         <DataCardLoading />
  //       </div>
  //     );
  //   }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="Pengajuan"
        value={246}
        percentageChange={20}
        icon={HiDocumentArrowDown}
        variant="warning"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Penyetujuan"
        value={114}
        percentageChange={20}
        icon={HiDocumentCheck}
        variant="success"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Penolakan"
        value={56}
        percentageChange={20}
        icon={HiDocumentMinus}
        variant="danger"
        dateRange={dateRangeLabel}
      />
    </div>
  );
};
