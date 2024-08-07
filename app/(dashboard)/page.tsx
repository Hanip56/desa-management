import Header from "./components/header";
import { getCurrentUser } from "@/lib/auth";
import { DataGrid } from "./components/data-grid";
import LatestPengajuan from "./components/latest-pengajuan";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main>
      <Header
        title={`Selamat Datang, ${user?.username
          .charAt(0)
          .toUpperCase()}${user?.username.slice(1)}`}
        subtitle="Aplikasi pengelolaan desa Margaasih"
      />

      {/* <div className="mt-8">
        <DataGrid />
      </div>
      <div className="mt-8 w-full flex gap-4">
        <div className="flex-1">
          <LatestPengajuan />
        </div>
        <div className="h-60 w-40 bg-white shadow-md" />
      </div> */}
    </main>
  );
}
