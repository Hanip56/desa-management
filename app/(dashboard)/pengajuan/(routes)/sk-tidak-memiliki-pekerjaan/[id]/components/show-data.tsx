import SemiField from "@/components/semi-field";
import { formatDate, getStatusPerkawinan } from "@/lib/utils";
import { SkTidakMemilikiPekerjaanWithUser } from "@/types";

type Props = {
  data: SkTidakMemilikiPekerjaanWithUser;
};

const ShowData = ({ data }: Props) => {
  return (
    <div className="sm:p-6 sm:border rounded-br-2xl rounded-bl-2xl">
      <div className="p-4 bg-muted">
        <h2 className="text-center text-lg font-semibold">Data Formulir</h2>
      </div>
      <div className="flex flex-col gap-y-10 md:gap-y-12 pt-6">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Nama" value={data.nama} />
            <SemiField label="NIK" value={data.nik} />
            <SemiField label="No. KK" value={data.noKk} />
            <SemiField label="Tempat Lahir" value={data.tempatLahir} />
            <SemiField
              label="Tanggal Lahir"
              value={formatDate(data.tanggalLahir)}
            />
            <SemiField
              label="Jenis Kelamin"
              value={data.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
            />
            <SemiField
              label="Status Perkawinan"
              value={getStatusPerkawinan(data.statusPerkawinan)}
            />
            <SemiField label="Pekerjaan" value={data.pekerjaan} />
            <SemiField label="Agama" value={data.agama} />
            <SemiField label="Alamat" value={data.alamat} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowData;
