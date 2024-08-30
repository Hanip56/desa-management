"use client";

import { Card, CardContent } from "@/components/ui/card";
import UpsertForm from "./upsert-form";
import { useConfirm } from "@/hooks/use-confirm";
import PersetujuanDialog from "./persetujuan-dialog";
import { useState } from "react";
import HeaderKonfirmasiPengajuan from "@/app/(dashboard)/components/header-konfirmasi-pengajuan";
import ShowData from "./show-data";
import HeaderHasilPengajuan from "@/app/(dashboard)/components/header-hasil-pengajuan";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateSkDomisiliSementara,
  updateSkDomisiliSementara,
} from "@/fetcher/sk-domisili-sementara-fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import TolakDialog from "./tolak-dialog";
import { SkDomisiliSementaraWithUser } from "@/types";

type Props = {
  initialData?: SkDomisiliSementaraWithUser;
};

const ClientComp = ({ initialData }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [persetujuanDialogOpen, setPersetujuanDialogOpen] = useState(false);
  const [tolakDialogOpen, setTolakDialogOpen] = useState(false);
  const [BatalDialog, confirmBatal] = useConfirm(
    "Batalkan pengajuan?",
    'Status pengajuan ini akan kembali ke "DIPROSES"'
  );

  const batalMutation = useMutation({
    mutationFn: updateSkDomisiliSementara,
    onSuccess: () => {
      toast("Pengajuan berhasil dibatalkan.", {
        className: "text-emerald-600 font-semibold",
      });
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["sk-domisili-sementaras"],
      });
    },
    onError: (error) => {
      toast("Pengajuan gagal dibatalkan.", {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const handleTolak = async () => {
    setTolakDialogOpen(true);
  };

  const handleTerima = () => {
    setPersetujuanDialogOpen(true);
  };

  const handleUnduh = async () => {
    if (!initialData) return;

    try {
      await generateSkDomisiliSementara({
        id: initialData?.id,
      });
    } catch (error) {
      toast("Gagal mengunduh pdf", {
        className: "text-rose-700 font-semibold",
      });
    }
  };

  const handleBatal = async () => {
    const ok = await confirmBatal();

    if (!ok || !initialData) return;

    batalMutation.mutate({
      body: { status: "DIPROSES" },
      id: initialData.id,
    });
  };

  return (
    <>
      <BatalDialog />

      {initialData && (
        <>
          <TolakDialog
            open={tolakDialogOpen}
            handleClose={() => setTolakDialogOpen(false)}
            initialData={initialData}
          />
          <PersetujuanDialog
            open={persetujuanDialogOpen}
            handleClose={() => setPersetujuanDialogOpen(false)}
            initialData={initialData}
          />
        </>
      )}
      <Card className="mt-8 rounded-2xl overflow-hidden">
        {/* for admin  When status is not 'diproses' */}
        {session?.user.role !== "USER" && initialData && (
          <HeaderKonfirmasiPengajuan
            nomorWa={initialData.user.nomorWa}
            tanggal={initialData.updatedAt}
            noSurat={initialData?.noSurat}
            tanggalPembuatan={initialData?.tanggalPembuatan}
            alasanDitolak={initialData?.pesanDitolak}
            status={initialData.status}
            handleTerima={handleTerima}
            handleTolak={handleTolak}
            handleBatal={handleBatal}
            handleUnduh={handleUnduh}
          />
        )}
        {/* for user  When status is not 'DIPROSES' */}
        {session?.user.role === "USER" &&
          initialData &&
          initialData.status !== "DIPROSES" && (
            <HeaderHasilPengajuan
              status={initialData.status}
              alasanDitolak={initialData.pesanDitolak}
              handleUnduh={handleUnduh}
              noSurat={initialData?.noSurat}
              tanggalPembuatan={initialData?.tanggalPembuatan}
            />
          )}

        <CardContent className="mt-8">
          {(initialData && initialData.status !== "DIPROSES") ||
          (initialData && session?.user.role !== "USER") ? (
            // after 'diproses'
            <ShowData data={initialData} />
          ) : (
            // before 'diproses'
            <UpsertForm initialData={initialData} />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ClientComp;
