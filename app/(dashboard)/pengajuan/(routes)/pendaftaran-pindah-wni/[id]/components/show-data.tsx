import SemiField from "@/components/semi-field";
import { formatDate } from "@/lib/utils";
import { PendaftaranPindahWniWithUser } from "@/types";

type Props = {
  data: PendaftaranPindahWniWithUser;
};

const ShowData = ({ data }: Props) => {
  return (
    <div className="sm:p-6 sm:border rounded-br-2xl rounded-bl-2xl">
      <div className="p-4 bg-muted">
        <h2 className="text-center text-lg font-semibold">Data Formulir</h2>
      </div>
      <div className="flex flex-col gap-y-10 md:gap-y-12 pt-6">
        {/* keterangan pemohon */}
        <div>
          <h2 className="text-xl font-medium mb-5">Keterangan pemohon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField
              label="Nama lengkap pemohon"
              value={data.namaLengkapPemohon}
            />
            <SemiField label="NIK" value={data.nik} />
            <SemiField label="No KK" value={data.noKk} />
            <SemiField label="Jenis Permohonan" value={data.jenisPermohonan} />
          </div>
        </div>
        {/* keterangan alamat asal */}
        <div>
          <h2 className="text-xl font-medium mb-5">Keterangan alamat asal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Alamat" value={data.alamatAsal} />
            <SemiField label="Desa" value={data.desaAsal} />
            <SemiField label="Kecamatan" value={data.kecamatanAsal} />
            <SemiField label="Kabupaten" value={data.kabupatenAsal} />
            <SemiField label="Provinsi" value={data.provinsiAsal} />
            <SemiField label="Kode pos" value={data.kodePosAsal} />
          </div>
        </div>
        {/* keterangan alamat tujuan */}
        <div>
          <h2 className="text-xl font-medium mb-5">Keterangan alamat tujuan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Alamat" value={data.alamatTujuan} />
            <SemiField label="Desa" value={data.desaTujuan} />
            <SemiField label="Kecamatan" value={data.kecamatanTujuan} />
            <SemiField label="Kabupaten" value={data.kabupatenTujuan} />
            <SemiField label="Provinsi" value={data.provinsiTujuan} />
            <SemiField label="Kode pos" value={data.kodePosTujuan} />
          </div>
        </div>
        {/* keterangan pindah */}
        <div>
          <h2 className="text-xl font-medium mb-5">Keterangan pindah</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField
              label="Klasifikasi kepindahan"
              value={data.klasifikasiKepindahan}
            />
            <SemiField label="Alasan pindah" value={data.alasanPindah} />
            <SemiField label="Jenis kepindahan" value={data.jenisKepindahan} />
          </div>
        </div>
        {/* keterangan anggota */}
        <div>
          <h2 className="text-xl font-medium mb-5">
            Keterangan anggota pindah
          </h2>

          <div className="flex flex-col gap-4">
            {data.anggotaPindah.map((anggota, i) => (
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowData;
