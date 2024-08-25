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

const legendData = [
  {
    name: "surat kelahiran",
    fill: "hsl(var(--chart-2))",
  },
  { name: "surat kematian", fill: "hsl(var(--chart-1))" },
  { name: "sk belum menikah", fill: "hsl(var(--chart-3))" },
  {
    name: "sk ijin keramaian",
    fill: "hsl(var(--chart-4))",
  },
  {
    name: "sk penghasilan orang tua",
    fill: "hsl(var(--chart-5))",
  },
];

const chartConfig = {
  suratKelahiran: {
    label: "Surat kelahiran",
    color: "hsl(var(--chart-2))",
  },
  suratKematian: {
    label: "Surat kematian",
    color: "hsl(var(--chart-1))",
  },
  skBelumMenikah: {
    label: "Sk belum menikah",
    color: "hsl(var(--chart-3))",
  },
  skIjinKeramaian: {
    label: "Sk ijin keramaian",
    color: "hsl(var(--chart-4))",
  },
  skPenghasilanOrangTua: {
    label: "Sk Penghasilan orang tua",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

type Props = {
  suratKelahiranCount: number;
  suratKematianCount: number;
  skBelumMenikahCount: number;
  skIjinKeramaianCount: number;
  skPenghasilanOrangTuaCount: number;
};

export default function PengajuanChart({
  skBelumMenikahCount,
  skIjinKeramaianCount,
  skPenghasilanOrangTuaCount,
  suratKelahiranCount,
  suratKematianCount,
}: Props) {
  const chartData = [
    {
      type: "suratKelahiran",
      maked: suratKelahiranCount,
      fill: "hsl(var(--chart-2))",
    },
    {
      type: "suratKematian",
      maked: suratKematianCount,
      fill: "hsl(var(--chart-1))",
    },
    {
      type: "skBelumMenikah",
      maked: skBelumMenikahCount,
      fill: "hsl(var(--chart-3))",
    },
    {
      type: "skIjinKeramaian",
      maked: skIjinKeramaianCount,
      fill: "hsl(var(--chart-4))",
    },
    {
      type: "skPenghasilanOrangTua",
      maked: skPenghasilanOrangTuaCount,
      fill: "hsl(var(--chart-5))",
    },
  ];

  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader className="items-center">
        <CardTitle className="text-xl">Tinjauan pengajuan</CardTitle>
        <CardDescription>diperoleh dari bulan ini</CardDescription>
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
      <CardFooter className="flex flex-wrap gap-x-4 gap-y-1">
        {legendData.map((data) => (
          <div key={data.name} className="flex items-center gap-2">
            <div className="w-2 h-2" style={{ backgroundColor: data.fill }} />{" "}
            <span className="text-[13px]">{data.name}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
