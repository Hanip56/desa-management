import Header from "./components/header";
import { getCurrentUser } from "@/lib/auth";
import { Suspense } from "react";
import MainDashboard, {
  MainDashboardSkeleton,
} from "./components/main-dashboard";

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

      <Suspense fallback={<MainDashboardSkeleton />}>
        <MainDashboard />
      </Suspense>
    </main>
  );
}
