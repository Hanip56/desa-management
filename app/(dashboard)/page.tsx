import { getCurrentUser } from "@/lib/auth";
import Image from "next/image";
import UserDashboard from "./components/user-dashboard";
import { Suspense } from "react";
import MainDashboard, {
  MainDashboardSkeleton,
} from "./components/main-dashboard";
import { NAMA_DESA } from "@/contants";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main>
      <div className="flex flex-col md:flex-row items-center h-[18.3rem] md:h-[17.3rem]">
        <div className="text-white flex-1 text-center md:text-start pb-8">
          <p className="hidden sm:inline font-medium mb-4 text-lg uppercase">
            DESA {NAMA_DESA}
          </p>
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-3">
            MAJU MANDIRI <span className="text-yellow-500">SINERGI</span>
          </h1>
          <p className="whitespace-pre-line text-sm sm:text-base md:tracking-wider font-light">
            Selamat datang {user?.username}, di aplikasi pengelolaan surat Desa{" "}
            {NAMA_DESA}
          </p>
        </div>
        <div className="relative -z-10 w-full self-end basis-[40%]">
          <Image
            src="/wakil_bupati.png"
            alt=""
            width={2000}
            height={2000}
            className="object-contain object-bottom w-[65%] h-40 md:h-[16.5rem] absolute right-0 bottom-0"
          />
          <Image
            src="/bupati.png"
            alt=""
            width={2000}
            height={2000}
            className="object-contain object-bottom w-[65%] h-44 md:h-[17rem] absolute left-0 bottom-0"
          />
        </div>
      </div>

      {/* for user */}
      {user?.role === "USER" ? (
        <UserDashboard />
      ) : (
        <Suspense fallback={<MainDashboardSkeleton />}>
          <MainDashboard />
        </Suspense>
      )}
    </main>
  );
}
