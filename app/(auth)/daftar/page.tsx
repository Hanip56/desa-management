import { Button } from "@/components/ui/button";
import DaftarForm from "../components/daftar-form";
import Link from "next/link";

const DaftarPage = () => {
  return (
    <div className="w-full flex items-center justify-center h-full p-4 py-6 sm:p-6 xl:p-10">
      <div className="w-full">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 md:mb-6">
          Daftar <span className="text-emerald-600">Akun</span>
        </h2>
        <DaftarForm />
        <div className="flex justify-center mt-2">
          <Button variant="link" asChild>
            <Link href="/masuk">Sudah punya akun? masuk</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DaftarPage;
