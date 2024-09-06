import SemiField from "@/components/semi-field";
import { formatDate, getGender, getStatusPerkawinan } from "@/lib/utils";
import { SkDomisiliSementaraWithUser } from "@/types";

type Props = {
  data: SkDomisiliSementaraWithUser;
};

const ShowData = ({ data }: Props) => {
  return (
    <div className="sm:p-6 sm:border rounded-br-2xl rounded-bl-2xl">
      <div className="p-4 bg-muted">
        <h2 className="text-center text-lg font-semibold">Data Formulir</h2>
      </div>
      <div className="flex flex-col gap-y-10 md:gap-y-12 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
          <SemiField label="Nama lengkap" value={data.namaLengkap} />
          <SemiField label="NIK" value={data.nik} />
          <SemiField
            label="Tanggal Lahir"
            value={formatDate(data.tanggalLahir)}
          />
          <SemiField
            label="Jenis Kelamin"
            value={getGender(data.jenisKelamin)}
          />
          <SemiField label="Agama" value={data.agama} />
          <SemiField label="Pekerjaan" value={data.pekerjaan} />
          <SemiField
            label="Status perkawinan"
            value={getStatusPerkawinan(data.statusPerkawinan)}
          />
          <SemiField label="Kewarganegaraan" value={data.kewarganegaraan} />
          <SemiField
            label="Domisili sementara"
            value={data.domisiliSementara}
          />
          <SemiField label="Alamat asal" value={data.alamat} />
        </div>
      </div>
    </div>
  );
};

export default ShowData;
