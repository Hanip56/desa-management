import Logo from "@/components/logo";
import Image from "next/image";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full bg-emerald-600 flex flex-col lg:flex-row">
      <div className="lg:basis-[40%] py-8 px-12 flex flex-col">
        <div className="text-white">
          <Logo />
        </div>
        <div className="text-white hidden lg:flex flex-col items-center justify-center h-full gap-[5%]">
          <h1 className="text-[2.1rem] font-bold leading-10">
            <span className="text-yellow-400">Selamat Datang</span> di Website
            Pengelolaan Desa
          </h1>
          <div className="mt-4 w-[60%] self-center flex items-center justify-center">
            <Image
              src="/dokumen.png"
              alt="dokumen"
              width={1000}
              height={1000}
              className=""
            />
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-tl-3xl rounded-tr-3xl lg:rounded-tr-none lg:rounded-bl-3xl md:p-10">
        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
