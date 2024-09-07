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
        title="Masuk"
        value={data1}
        icon={HiDocumentArrowDown}
        variant="default"
      />
      <DataCard
        title="Diproses"
        value={data2}
        icon={HiDocumentMinus}
        variant="warning"
      />
      <DataCard
        title="Diterima"
        value={data3}
        icon={HiDocumentCheck}
        variant="success"
      />
    </div>
  );
};
