"use client";

import {
  HiDocumentArrowDown,
  HiDocumentCheck,
  HiDocumentMinus,
} from "react-icons/hi2";
import { DataCard } from "./data-card";

type Props = {
  data1: number;
  data2: number;
  data3: number;
};

export const DataGrid = ({ data1, data2, data3 }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="Pengajuan"
        value={data1}
        icon={HiDocumentArrowDown}
        variant="warning"
      />
      <DataCard
        title="Penyetujuan"
        value={data2}
        icon={HiDocumentCheck}
        variant="success"
      />
      <DataCard
        title="Penolakan"
        value={data3}
        icon={HiDocumentMinus}
        variant="danger"
      />
    </div>
  );
};
