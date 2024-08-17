"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import { ColumnsType } from "./columns";
import { useConfirm } from "@/hooks/use-confirm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSuratKematian } from "@/fetcher/surat-kematian-fetcher";
import { toast } from "sonner";

type CellActionProps = {
  data: ColumnsType;
};

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const queryClient = useQueryClient();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Apa anda yakin?",
    "Anda akan membatalkan pengajuan ini"
  );

  const deleteMutation = useMutation({
    mutationFn: deleteSuratKematian,
    onSuccess: (data) => {
      toast("Data berhasil dibatalkan.", {
        className: "text-emerald-600 font-semibold",
      });

      queryClient.invalidateQueries({
        queryKey: ["surat-kematians"],
      });
    },
    onError: (error) => {
      toast("Data gagal dibatalkan.", {
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="mr-2 size-4" /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
