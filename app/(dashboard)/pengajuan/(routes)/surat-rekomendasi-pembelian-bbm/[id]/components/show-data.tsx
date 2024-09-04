import SemiField from "@/components/semi-field";
import { formatDate, getAlamat, getStatusPerkawinan } from "@/lib/utils";
import { SuratRekomendasiPembelianBbmWithUser } from "@/types";

type Props = {
  data: SuratRekomendasiPembelianBbmWithUser;
};

const ShowData = ({ data }: Props) => {
  return (
    <div className="sm:p-6 sm:border">
      <div className="p-4 bg-muted">
        <h2 className="text-center text-lg font-semibold">Data Formulir</h2>
      </div>
      {/* keterangan pemohon */}
      <div className="flex flex-col gap-y-10 md:gap-y-12 pt-6">
        <div>
          <h2 className="text-xl font-medium mb-5">Keterangan pemohon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Nama" value={data.nama} />
            <SemiField label="NIK" value={data.nik} />
            <SemiField label="Alamat usaha" value={data.alamatUsaha} />
            <SemiField
              label="Konsumen pengguna"
              value={data.konsumenPengguna}
            />
            <SemiField
              label="Jenis usaha kegiatan"
              value={data.jenisUsahaKegiatan}
            />
          </div>
        </div>
      </div>
      {/* keterangan alat */}
      <div className="flex flex-col gap-y-10 md:gap-y-12 pt-6">
        <div>
          <h2 className="text-xl font-medium mb-5">Keterangan alat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Jenis alat" value={data.jenisAlat} />
            <SemiField label="Jumlah alat" value={data.jumlahAlat.toString()} />
            <SemiField label="Fungsi alat" value={data.fungsiAlat} />
            <SemiField label="Jam operasi" value={data.jamOperasi} />
            <SemiField
              label="Konsumsi jenis bbm tertentu liter per hari"
              value={data.konsumsi}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowData;
