import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { suratList } from "@/contants";
import { Circle, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const UserDashboard = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-8 -mt-8">
      {suratList.map((surat) => (
        <Link href={surat.href} key={surat.href}>
          <Card className="border-none drop-shadow-md rounded-3xl overflow-hidden group hover:ring-1 ring-emerald-600/50 transition-all cursor-pointer w-full h-full">
            <div className="absolute hidden  group-hover:block  bottom-0 left-0 -z w-full h-32 bg-gradient-to-b from-transparent to-emerald-300/10" />
            <CardHeader className="pt-4 sm:pt-8 pb-2">
              <CardTitle className="flex items-center justify-center">
                {surat.type === "online" && (
                  <Badge className="bg-emerald-600/20 hover:bg-emerald-600/20 text-emerald-600 hover:text-emerald-600">
                    <Circle className="size-2 mr-1" /> online
                  </Badge>
                )}
                {surat.type === "offline" && (
                  <Badge className="bg-slate-500/20 text-slate-600 hover:bg-slate-500/20 hover:text-slate-600">
                    <Minus className="size-2 mr-1" /> offline
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2 sm:gap-6 p-4 sm:p-8 pt-2 sm:pt-6">
              <Image
                src={
                  surat.type === "online"
                    ? "/document-icon.png"
                    : "/document-icon-bw.png"
                }
                alt="document icon"
                width={500}
                height={500}
                className="size-16 sm:size-24 md:size-32"
              />
              <p className="font-medium text-center text-xs sm:text-base">
                {surat.name}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default UserDashboard;

{
  /* <div className="flex gap-8 -mt-6">
        <Card className="border-none drop-shadow-md p-10 flex-1">
          <div className="flex gap-8 items-center justify-center">
            <div>
              <Newspaper className="size-10 text-sky-600" />
            </div>
            <div>
              <h6 className="font-semibold">
                Sebelum Membuat Pengajuan Mohon Lampirkan Dokumen Data Diri Anda
              </h6>
              <p className="text-sm">
                Unggah dokumen anda dengan menekan tombol dibawah ini!
              </p>
              <Button size="sm" className="rounded-full mt-6 text-xs">
                <Plus className="size-4 mr-2" /> Tambahkan
              </Button>
            </div>
          </div>
        </Card>
        <Card className="border-none drop-shadow-md p-10 basis-[32%]"></Card>
      </div> */
}
