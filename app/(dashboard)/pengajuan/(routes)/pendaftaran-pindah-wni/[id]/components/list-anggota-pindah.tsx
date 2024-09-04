import SemiField from "@/components/semi-field";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { AnggotaPindahSchema } from "@/schemas/pendaftaran-pindah-wni";
import { PenIcon, TrashIcon } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { z } from "zod";

type Props = {
  anggotaPindah: z.infer<typeof AnggotaPindahSchema>[];
  setUpsertAnggotaOpenId: Dispatch<SetStateAction<number | undefined>>;
  handleDelete: (idx: number) => void;
};

const ListAnggotaPindah = ({
  anggotaPindah,
  setUpsertAnggotaOpenId,
  handleDelete,
}: Props) => {
  if (anggotaPindah.length < 1) return;

  const handleEdit = (idx: number) => {
    setUpsertAnggotaOpenId(idx);
  };

  return (
    <div className="flex flex-col gap-4">
      {anggotaPindah.map((anggota, i) => (
        <div key={`anggota-${i}`} className="flex gap-4 w-full">
          <p>{i + 1}.</p>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <SemiField label="Nama lengkap" value={anggota.namaLengkap} />
            <SemiField label="NIK" value={anggota.nik} />
            <SemiField
              label="Masa berlaku KTP"
              value={formatDate(anggota.masaBerlakuKtp)}
            />
            <SemiField label="SHDK" value={anggota.shdk} />
          </div>
          <div className="flex flex-col sm:flex-row gap-1">
            <Button
              type="button"
              size="icon"
              className="bg-emerald-600/15 text-emerald-600 hover:bg-emerald-600/5 size-8"
              onClick={() => handleEdit(i)}
            >
              <PenIcon className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              className="bg-rose-700/15 text-rose-700 hover:bg-rose-700/5 size-8"
              onClick={() => handleDelete(i)}
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListAnggotaPindah;
