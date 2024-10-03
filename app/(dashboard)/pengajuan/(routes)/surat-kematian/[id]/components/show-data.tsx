import SemiField from "@/components/semi-field";
import { DateToDayAndDate, DatetoTime } from "@/lib/utils";
import { SuratKematianWithUser } from "@/types";

type Props = {
  data: SuratKematianWithUser;
};

const ShowData = ({ data }: Props) => {
  // this is for matching on the VPS
  const offset = data.tanggal.getTimezoneOffset() * 60000;
  const tanggal = new Date(data.tanggal.getTime() + offset);
  // const tanggal =
  //   process.env.NEXT_PUBLIC_NODE_ENV === "development"
  //     ? data.tanggal
  //     : new Date(data.tanggal.getTime() + offset);

  return (
    <div className="sm:p-6 sm:border rounded-br-2xl rounded-bl-2xl">
      <div className="p-4 bg-muted">
        <h2 className="text-center text-lg font-semibold">Data Formulir</h2>
      </div>
      <div className="flex flex-col gap-y-10 md:gap-y-12 pt-6">
        <div>
          <h2 className="text-xl font-medium mb-5">Keterangan pemohon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Nama" value={data.namaPemohon} />
            <SemiField
              label="Jenis Kelamin"
              value={
                data.jenisKelaminPemohon === "L" ? "Laki-laki" : "Perempuan"
              }
            />
            <SemiField label="No. NIK" value={data.noNikPemohon} />
            <SemiField label="Alamat" value={data.alamatPemohon} />
            <SemiField
              label="Hubungan Keluarga"
              value={data.hubunganKeluargaPemohon}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-medium mb-5">
            Keterangan orang yang meninggal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Nama" value={data.namaTerkait} />
            <SemiField
              label="Jenis Kelamin"
              value={
                data.jenisKelaminTerkait === "L" ? "Laki-laki" : "Perempuan"
              }
            />
            <SemiField label="No. NIK" value={data.noNikTerkait} />
            <SemiField label="Alamat" value={data.alamatTerkait} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-medium mb-5">Keterangan meninggal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Hari/Tanggal" value={DateToDayAndDate(tanggal)} />
            <SemiField label="Waktu" value={`${DatetoTime(tanggal)}`} />
            <SemiField label="Penyebab" value={data.penyebab} />
            <SemiField label="Tempat" value={data.tempat} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowData;
