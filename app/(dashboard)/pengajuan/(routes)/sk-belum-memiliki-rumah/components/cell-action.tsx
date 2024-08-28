"use client";

import { ColumnsType } from "./columns";
import { useConfirm } from "@/hooks/use-confirm";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSkBelumMemilikiRumah } from "@/fetcher/sk-belum-memiliki-rumah-fetcher";
import { toast } from "sonner";
import CellActionPengajuan from "@/app/(dashboard)/components/cell-action-pengajuan";

type CellActionProps = {
  data: ColumnsType;
};

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { data: session } = useSession();
  const isUser = session?.user.role === "USER";

  const queryClient = useQueryClient();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Apa anda yakin?",
    isUser
      ? "Anda akan membatalkan pengajuan ini"
      : "pengajuan ini akan dihapus ( berlaku juga untuk user )."
  );

  const deleteMutation = useMutation({
    mutationFn: deleteSkBelumMemilikiRumah,
    onSuccess: (data) => {
      toast(`Data berhasil ${isUser ? "dibatalkan" : "dihapus"}.`, {
        className: "text-emerald-600 font-semibold",
      });

      queryClient.invalidateQueries({
        queryKey: ["sk-belum-memiliki-rumahs"],
      });
    },
    onError: (error) => {
      toast(`Data gagal ${isUser ? "dibatalkan" : "dihapus"}.`, {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    deleteMutation.mutate({
      id: data.id,
    });
  };

  return (
    <>
      <ConfirmationDialog />
      <CellActionPengajuan
        handleDelete={handleDelete}
        id={data.id}
        status={data.status}
      />
    </>
  );
};

export default CellAction;
