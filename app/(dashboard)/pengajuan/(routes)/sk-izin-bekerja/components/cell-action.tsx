"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScanSearch, MoreHorizontal, Trash, Edit } from "lucide-react";
import { ColumnsType } from "./columns";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSkIzinBekerja } from "@/fetcher/sk-izin-bekerja-fetcher";
import { toast } from "sonner";

type CellActionProps = {
  data: ColumnsType;
};

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Apa anda yakin?",
    "Anda akan membatalkan pengajuan ini"
  );

  const deleteMutation = useMutation({
    mutationFn: deleteSkIzinBekerja,
    onSuccess: (data) => {
      toast("Data berhasil dibatalkan.", {
        className: "text-emerald-600 font-semibold",
      });

      queryClient.invalidateQueries({
        queryKey: ["sk-izin-bekerjas"],
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
          {(session?.user.role === "ADMIN" || data.status !== "DIPROSES") && (
            <DropdownMenuItem asChild>
              <Link
                href={`sk-izin-bekerja/${data.id}`}
                className="flex items-center"
              >
                <ScanSearch className="mr-2 size-4" /> Lihat Detail
              </Link>
            </DropdownMenuItem>
          )}
          {session?.user.role === "USER" && data.status === "DIPROSES" && (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`sk-izin-bekerja/${data.id}`)}
              >
                <Edit className="mr-2 size-4" /> Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleDelete}>
                <Trash className="mr-2 size-4" /> Batal
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
