"use client";

import NextJsImage from "@/components/nextjs-image";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const ShowUserData = ({
  ktpUrl,
  kkUrl,
  title = "Dokumen pemohon",
}: {
  ktpUrl: string | undefined;
  kkUrl: string | undefined;
  title?: string;
}) => {
  const [open, setOpen] = useState(false);

  if (!ktpUrl || !kkUrl) return;

  return (
    <>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[
          {
            src: ktpUrl,
          },
          {
            src: kkUrl,
          },
        ]}
        render={{ slide: NextJsImage }}
        plugins={[Zoom]}
      />
      <div className="sm:p-6 sm:border mb-6">
        <div className="p-4 bg-muted flex flex-col sm:flex-row gap-2 justify-center items-center">
          <h2 className="text-center text-lg font-semibold">{title}</h2>
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full px-4"
          >
            <HiMagnifyingGlass size={20} className="mr-2" /> Lihat
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 py-6 [&>*]:flex-1">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-center">KTP</p>
            <Image
              src={ktpUrl}
              alt="ktp"
              width={2000}
              height={2000}
              className="object-contain w-full h-60"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-center">KK</p>
            <Image
              src={kkUrl}
              alt="kk"
              width={2000}
              height={2000}
              className="object-contain w-full h-60"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowUserData;
