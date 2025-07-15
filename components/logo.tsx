import Image from "next/image";
import React from "react";
import Link from "next/link";
import { NAMA_DESA, NAMA_KABUPATEN } from "@/contants";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo-desa.png"
        alt="Logo Desa"
        width={1000}
        height={1000}
        className="w-12 object-cover"
      />
      <div>
        <p className="font-semibold leading-[0.6rem] uppercase">{NAMA_DESA}</p>
        <small className="text-[0.6rem] font-light text-nowrap uppercase">
          KABUPATEN {NAMA_KABUPATEN}
        </small>
      </div>
    </Link>
  );
};

export default Logo;
