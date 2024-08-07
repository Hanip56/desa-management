import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { formatTanggal } from "@/lib/utils";
import { CheckIcon, Download, XIcon } from "lucide-react";

type Props = {
  email: string;
  tanggal: string;
  noSurat?: string;
  tanggalPembuatan?: string;
  alasanDitolak?: string;
  status: "DIPROSES" | "DITERIMA" | "DITOLAK";
  handleTerima: () => void;
  handleTolak: () => Promise<void>;
  handleUnduh: () => void;
  handleBatal: () => Promise<void>;
};

const HeaderKonfirmasiPengajuan = ({
  email,
  tanggal,
  status,
  noSurat,
  tanggalPembuatan,
  alasanDitolak,
  handleTerima,
  handleTolak,
  handleBatal,
  handleUnduh,
}: Props) => {
  return (
    <CardHeader>
      <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between border border-slate-300 rounded-2xl p-6">
        <div className="space-y-2">
          {status !== "DIPROSES" && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Status :</span>{" "}
              {status === "DITERIMA" ? (
                <Badge className="bg-emerald-600 hover:bg-emerald-600">
                  DITERIMA
                </Badge>
              ) : (
                <Badge className="bg-rose-700 hover:bg-rose-700">DITOLAK</Badge>
              )}
            </div>
          )}
          {status === "DITOLAK" && alasanDitolak && (
            <>
              <div>
                <span className="font-semibold">Alasan ditolak :</span>{" "}
                <span className="font-semibold text-rose-700">
                  {alasanDitolak}
                </span>
              </div>
            </>
          )}
          {status === "DITERIMA" && (
            <>
              <div>
                <span className="font-semibold">No Surat :</span> {noSurat}
              </div>
              <div>
                <span className="font-semibold">Tanggal Pembuatan :</span>{" "}
                {tanggalPembuatan ? formatTanggal(tanggalPembuatan) : ""}
              </div>
            </>
          )}
          <div>
            <span className="font-semibold">Email Pengaju:</span> {email}
          </div>
          <div>
            <span className="font-semibold">Tanggal Pengajuan :</span>{" "}
            {formatTanggal(tanggal)}
          </div>
        </div>
        {status === "DIPROSES" && (
          <div className="flex flex-col sm:flex-row gap-2 sm:self-end items-center mt-8">
            <Button
              className="w-full sm:w-fit rounded-xl font-semibold"
              size="lg"
              variant="destructive"
              onClick={handleTolak}
            >
              <XIcon className="mr-2 size-5" /> Tolak
            </Button>
            <Button
              className="w-full sm:w-fit rounded-xl font-semibold"
              size="lg"
              variant="confirm"
              onClick={handleTerima}
            >
              <CheckIcon className="mr-4 size-5" /> Terima
            </Button>
          </div>
        )}
        {status === "DITERIMA" && (
          <div className="flex flex-col sm:flex-row self-end gap-2 items-center mt-8">
            <Button
              className="w-full sm:w-fit bg-destructive/10 text-red-600 hover:text-primary-foreground"
              variant="destructive"
              size="lg"
              onClick={handleBatal}
            >
              <XIcon className="mr-2 size-5" /> Batalkan
            </Button>
            <Button
              className="w-full sm:w-fit bg-sky-600 hover:bg-sky-600/80"
              size="lg"
              onClick={handleUnduh}
            >
              <Download className="mr-2 size-5" /> Unduh
            </Button>
          </div>
        )}
      </div>
    </CardHeader>
  );
};

export default HeaderKonfirmasiPengajuan;
