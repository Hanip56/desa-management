import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Download } from "lucide-react";
import StatusBadge from "./status-badge";

type Props = {
  status: "DITERIMA" | "DITOLAK";
  alasanDitolak?: string | null;
  noSurat?: string | null;
  tanggalPembuatan?: Date | null;
  handleUnduh: () => void;
};

const HeaderHasilPengajuan = ({
  status,
  alasanDitolak,
  handleUnduh,
  noSurat,
  tanggalPembuatan,
}: Props) => {
  return (
    <CardHeader>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between rounded-tr-2xl rounded-tl-2xl border border-slate-300 p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Status :</span>
            {status === "DITERIMA" ? (
              <StatusBadge status="DITERIMA" />
            ) : (
              <StatusBadge status="DITOLAK" />
            )}
          </div>
          {alasanDitolak && (
            <div>
              <span className="font-semibold">Alasan ditolak :</span>{" "}
              <span className="font-semibold text-rose-700">
                {alasanDitolak}
              </span>
            </div>
          )}
          {status === "DITERIMA" && (
            <>
              <div>
                <span className="font-semibold">No Surat :</span> {noSurat}
              </div>
              <div>
                <span className="font-semibold">Tanggal Pembuatan :</span>{" "}
                {tanggalPembuatan ? formatDate(tanggalPembuatan) : ""}
              </div>
            </>
          )}
        </div>
        {status === "DITERIMA" && (
          <Button
            className="w-full sm:w-fit bg-sky-600 hover:bg-sky-600/80 rounded-xl"
            size="lg"
            onClick={handleUnduh}
          >
            <Download className="mr-2 size-5" /> Unduh
          </Button>
        )}
      </div>
    </CardHeader>
  );
};

export default HeaderHasilPengajuan;
