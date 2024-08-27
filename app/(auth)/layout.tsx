import Logo from "@/components/logo";
import Image from "next/image";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full bg-emerald-600 flex flex-col lg:flex-row">
      <div className="max-w-screen-sm lg:basis-[40%] py-8 px-12 flex flex-col">
        <div className="text-white">
          <Logo />
        </div>
        <div className="text-white hidden lg:flex flex-col items-center justify-center h-full gap-[5%]">
          <h1 className="text-[2.1rem] font-bold leading-10 text-center">
            Selamat Datang di Website Pengelolaan{" "}
            <span className="text-yellow-400">Desa Margaasih</span>
          </h1>
          <div className="w-[90%] mt-4 flex items-center justify-center">
            <div className="flex gap-10 [&>*]:flex-1">
              <div className="relative">
                <div className="absolute h-[5%] w-full bottom-0 bg-gradient-to-b from-transparent to-emerald-600" />
                <Image
                  src="/Bupati.png"
                  alt="dokumen"
                  width={1000}
                  height={1000}
                  className=""
                />
                <div className="absolute pt-1 text-center w-[120%] left-1/2 -translate-x-1/2">
                  <p className="underline text-xs font-semibold leading-4">
                    Dr. A.M Dadang Supriatna, S.IP., M.Si
                  </p>
                  <p className="text-[0.7rem] leading-4">
                    Bupati Kabupaten Bandung
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute h-[5%] w-full bottom-0 bg-gradient-to-b from-transparent to-emerald-600" />
                <Image
                  src="/kades.png"
                  alt="dokumen"
                  width={1000}
                  height={1000}
                  className=""
                />
                <div className="absolute pt-1 text-center w-[120%] left-1/2 -translate-x-1/2">
                  <p className="underline text-xs font-semibold leading-4">
                    Yayan Suryana
                  </p>
                  <p className="text-[0.7rem] leading-4">
                    Kepala Desa Margaasih
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-tl-3xl rounded-tr-3xl lg:rounded-tr-none lg:rounded-bl-3xl md:p-10">
        <div className="max-w-screen-lg mx-auto  w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
