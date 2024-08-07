import { Button } from "@/components/ui/button";
import MasukForm from "../components/masuk-form";
import Link from "next/link";

const MasukPage = () => {
  return (
    <div className="w-full flex items-center justify-center h-full p-4 sm:p-6 xl:p-10">
      <div className="w-full">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 md:mb-6 text-emerald-600">
          Masuk
        </h2>
        <MasukForm />
        <div className="flex justify-center mt-2">
          <Button variant="link" asChild>
            <Link href="/daftar">Belum punya akun? daftar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MasukPage;
