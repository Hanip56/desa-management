import SemiField from "@/components/semi-field";
import {
  DateToDayAndDate,
  DatetoTime,
  formatDate,
  getAlamat,
} from "@/lib/utils";
import { SkIjinKeramaianWithUser } from "@/types";

type Props = {
  data: SkIjinKeramaianWithUser;
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
            <SemiField label="Nama lengkap" value={data.nama} />
            <SemiField label="NIK" value={data.nik} />
            <SemiField label="Tempat Lahir" value={data.tempatLahir} />
            <SemiField
              label="Tanggal Lahir"
              value={formatDate(data.tanggalLahir)}
            />
            <SemiField label="Alamat" value={data.alamat} />
            <SemiField
              label="Waktu"
              value={`${DateToDayAndDate(data.waktu)}, ${DatetoTime(
                data.waktu
              )}`}
            />
            <SemiField label="Maksud" value={data.maksud} />
            <SemiField label="Acara" value={data.acara} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowData;
