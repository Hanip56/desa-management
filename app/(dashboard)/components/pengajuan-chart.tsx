"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartColors = [
  "#1f77b4", // Blue
  "#ff7f0e", // Orange
  "#2ca02c", // Green
  "#d62728", // Red
  "#9467bd", // Purple
  "#8c564b", // Brown
  "#e377c2", // Pink
  "#7f7f7f", // Gray
  "#bcbd22", // Olive
  "#17becf", // Teal
  "#e41a1c", // Red
  "#377eb8", // Blue
  "#4daf4a", // Green
  "#ff9933", // Orange
  "#a65628", // Brown
];

const chartConfig = {
  suratKelahiran: {
    label: "Surat kelahiran",
    color: chartColors[0],
  },
  suratKematian: {
    label: "Surat kematian",
    color: chartColors[1],
  },
  skBelumMenikah: {
    label: "Sk belum menikah",
    color: chartColors[2],
  },
  skIjinKeramaian: {
    label: "Sk ijin keramaian",
    color: chartColors[3],
  },
  skPenghasilanOrangTua: {
    label: "Sk Penghasilan orang tua",
    color: chartColors[4],
  },
  skIzinBekerja: {
    label: "Sk izin bekerja",
    color: chartColors[5],
  },
  SkBelumMemilikiRumah: {
    label: "Sk belum memiliki rumah",
    color: chartColors[6],
  },
  SkTidakMemilikiPekerjaan: {
    label: "Sk tidak memiliki pekerjaan",
    color: chartColors[7],
  },
  SkUsaha: {
    label: "Sk usaha",
    color: chartColors[8],
  },
  SkDomisiliLembaga: {
    label: "Sk domisili lembaga",
    color: chartColors[9],
  },
  SkDomisiliImigrasi: {
    label: "Sk domsili imigrasi",
    color: chartColors[10],
  },
  SkDomisiliSementara: {
    label: "Sk domsili sementara",
    color: chartColors[11],
  },
  SkTidakMampu: {
    label: "Sk tidak mampu",
    color: chartColors[12],
  },
  SuratRekomendasiPembelianBbm: {
    label: "Surat rekomendasi pembelian bbm",
    color: chartColors[13],
  },
  PendaftaranPindahWni: {
    label: "Pendaftaran pindah wni",
    color: chartColors[14],
  },
} satisfies ChartConfig;

type Props = {
  suratKelahiranCount: number;
  suratKematianCount: number;
  skBelumMenikahCount: number;
  skIjinKeramaianCount: number;
  skPenghasilanOrangTuaCount: number;
  skIzinBekerjaCount: number;
  skBelumMemilikiRumahCount: number;
  skTidakMemilikiPekerjaanCount: number;
  skUsahaCount: number;
  skDomisiliLembagaCount: number;
  skDomisiliImigrasiCount: number;
  skDomisiliSementaraCount: number;
  skTidakMampuCount: number;
  suratRekomendasiPembelianBbmCount: number;
  pendaftaranPindahWniCount: number;
};

export default function PengajuanChart({
  suratKelahiranCount,
  suratKematianCount,
  skBelumMenikahCount,
  skIjinKeramaianCount,
  skPenghasilanOrangTuaCount,
  skIzinBekerjaCount,
  skBelumMemilikiRumahCount,
  skTidakMemilikiPekerjaanCount,
  skUsahaCount,
  skDomisiliLembagaCount,
  skDomisiliImigrasiCount,
  skDomisiliSementaraCount,
  skTidakMampuCount,
  suratRekomendasiPembelianBbmCount,
  pendaftaranPindahWniCount,
}: Props) {
  const chartData = [
    {
      type: "suratKelahiran",
      maked: suratKelahiranCount,
      fill: chartColors[0],
    },
    {
      type: "suratKematian",
      maked: suratKematianCount,
      fill: chartColors[1],
    },
    {
      type: "skBelumMenikah",
      maked: skBelumMenikahCount,
      fill: chartColors[2],
    },
    {
      type: "skIjinKeramaian",
      maked: skIjinKeramaianCount,
      fill: chartColors[3],
    },
    {
      type: "skPenghasilanOrangTua",
      maked: skPenghasilanOrangTuaCount,
      fill: chartColors[4],
    },
    {
      type: "skIzinBekerja",
      maked: skIzinBekerjaCount,
      fill: chartColors[5],
    },
    {
      type: "skBelumMemilikiRumah",
      maked: skBelumMemilikiRumahCount,
      fill: chartColors[6],
    },
    {
      type: "skTidakMemilikiPekerjaan",
      maked: skTidakMemilikiPekerjaanCount,
      fill: chartColors[7],
    },
    {
      type: "skUsaha",
      maked: skUsahaCount,
      fill: chartColors[8],
    },
    {
      type: "skDomisiliLembaga",
      maked: skDomisiliLembagaCount,
      fill: chartColors[9],
    },
    {
      type: "skDomisiliImigrasi",
      maked: skDomisiliImigrasiCount,
      fill: chartColors[10],
    },
    {
      type: "skDomisiliSementara",
      maked: skDomisiliSementaraCount,
      fill: chartColors[11],
    },
    {
      type: "skTidakMampu",
      maked: skTidakMampuCount,
      fill: chartColors[12],
    },
    {
      type: "suratRekomendasiPembelianBbm",
      maked: suratRekomendasiPembelianBbmCount,
      fill: chartColors[13],
    },
    {
      type: "pendaftaranPindahWni",
      maked: pendaftaranPindahWniCount,
      fill: chartColors[14],
    },
  ];

  const palingSeringDiajukan = chartData.reduce(
    (acc, cur) =>
      acc.count < cur.maked ? { type: cur.type, count: cur.maked } : acc,
    { type: "", count: 0 }
  );

  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-xl">Tinjauan pengajuan</CardTitle>
        <CardDescription>persentase pengajuan yang masuk</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 h-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-[73%] h-[73%]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="maked"
              nameKey="type"
              innerRadius={40}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-x-4 gap-y-1 mt-10">
        <p className="text-sm font-semibold">Paling sering diajukan:</p>
        <p className="text-sm">
          {palingSeringDiajukan.type} / {palingSeringDiajukan.count}
        </p>
      </CardFooter>
    </Card>
  );
}
