import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusType } from "@/types";
import { Edit, MoreHorizontal, ScanSearch, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type Props = {
  status: StatusType;
  id: string;
  handleDelete: () => void;
};

const CellActionPengajuan = ({ handleDelete, id, status }: Props) => {
  const { data: session } = useSession();
  const isUser = session?.user.role === "USER";

  const pengajuan = usePathname();

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-8 h-8 p-0">
          <span className="sr-only">Buka menu</span>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(session?.user.role === "ADMIN" || status !== "DIPROSES") && (
          <DropdownMenuItem asChild>
            <Link href={`${pengajuan}/${id}`} className="flex items-center">
              <ScanSearch className="mr-2 size-4" /> Lihat Detail
            </Link>
          </DropdownMenuItem>
        )}
        {session?.user.role === "USER" && status === "DIPROSES" && (
          <DropdownMenuItem onClick={() => router.push(`${pengajuan}/${id}`)}>
            <Edit className="mr-2 size-4" /> Edit
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleDelete}>
          <Trash className="mr-2 size-4" /> {isUser ? "Batal" : "Hapus"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellActionPengajuan;
