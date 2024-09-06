"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { suratList } from "@/contants";
import { Circle, Minus, SearchIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import UploadDocument from "./upload-document";
import { useSession } from "next-auth/react";

const PengajuanBeranda = () => {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");

  const filteredSuratList = search
    ? suratList.filter((list) =>
        list.name.toLowerCase().includes(search.toLowerCase())
      )
    : suratList;

  const isVerifiedDocument = session?.user.ktpUrl && session.user.kkUrl;

  return (
    <div className="-mt-8">
      {!isVerifiedDocument && <UploadDocument />}

      {!!isVerifiedDocument && (
        <div>
          <div className="relative max-w-4xl">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pengajuan"
              className="rounded-full shadow-md px-6 pl-12 py-4 h-12 sm:h-14 focus-visible:ring-emerald-500"
            ></Input>
          </div>

          {filteredSuratList.length < 1 ? (
            <div className="w-full h-40 flex items-center justify-center rounded-2xl shadow-md mt-10 text-slate-500">
              <XIcon className="size-6 mr-2" />
              <p className="text-sm font-medium">Pengajuan tidak ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-8 mt-10">
              {filteredSuratList.map((surat) => (
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
                        className="size-20 sm:size-28 md:size-40 object-contain"
                      />
                      <p className="font-medium text-center text-xs sm:text-base">
                        {surat.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PengajuanBeranda;

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
