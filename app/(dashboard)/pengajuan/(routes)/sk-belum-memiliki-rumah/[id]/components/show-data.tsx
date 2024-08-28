import SemiField from "@/components/semi-field";
import {
  DateToDayAndDate,
  DatetoTime,
  formatDate,
  getAlamat,
} from "@/lib/utils";
import { SkBelumMemilikiRumahWithUser } from "@/types";

type Props = {
  data: SkBelumMemilikiRumahWithUser;
};

const ShowData = ({ data }: Props) => {
  return (
    <div className="sm:p-6 sm:border">
      <div className="p-4 bg-muted">
        <h2 className="text-center text-lg font-semibold">Data Formulir</h2>
      </div>
      <div className="flex flex-col gap-y-10 md:gap-y-12 pt-6">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Nama lengkap" value={data.namaLengkap} />
            <SemiField label="NIK" value={data.nik} />
            <SemiField
              label="Tanggal Lahir"
              value={formatDate(data.tanggalLahir)}
            />
            <SemiField
              label="Jenis Kelamin"
              value={data.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
            />
            <SemiField label="Agama" value={data.agama} />
            <SemiField label="Pekerjaan" value={data.pekerjaan} />
            <SemiField
              label="Status perkawinan"
              value={data.statusPerkawinan.replace("_", " ")}
            />
            <SemiField label="Kewarganegaraan" value={data.kewarganegaraan} />
            <SemiField
              label="Alamat"
              value={getAlamat(data.kampung, data.rt, data.rw)}
            />
            <SemiField label="Keperluan" value={data.keperluan} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowData;
