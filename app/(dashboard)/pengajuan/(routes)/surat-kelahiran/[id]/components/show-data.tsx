import SemiField from "@/components/semi-field";
import { formatDate, getAlamat } from "@/lib/utils";
import { SuratKelahiranWithUser } from "@/types";

type Props = {
  data: SuratKelahiranWithUser;
};

const ShowData = ({ data }: Props) => {
  return (
    <div className="sm:p-6 sm:border">
      <div className="p-4 bg-muted">
        <h2 className="text-center text-lg font-semibold">Data Formulir</h2>
      </div>
      <div className="flex flex-col gap-y-10 md:gap-y-12 pt-6">
        <div>
          <h2 className="text-xl font-medium mb-5">Keterangan orang terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Nama" value={data.namaTerkait} />
            <SemiField
              label="Jenis Kelamin"
              value={
                data.jenisKelaminTerkait === "L" ? "Laki-laki" : "Perempuan"
              }
            />
            <SemiField
              label="Alamat"
              value={getAlamat(
                data.kampungTerkait,
                data.rtTerkait,
                data.rwTerkait
              )}
            />
            <SemiField
              label="Tempat tanggal lahir"
              value={`${data.tempatLahirTerkait}, ${formatDate(
                data.tanggalLahirTerkait
              )}`}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-medium mb-5">Keterangan Ayah</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Nama" value={data.namaAyah} />
            <SemiField
              label="Jenis Kelamin"
              value={data.jenisKelaminAyah === "L" ? "Laki-laki" : "Perempuan"}
            />
            <SemiField
              label="Alamat"
              value={getAlamat(data.kampungAyah, data.rtAyah, data.rwAyah)}
            />
            <SemiField label="Agama" value={data.agamaAyah} />
            <SemiField
              label="Tempat tanggal lahir"
              value={`${data.tempatLahirAyah}, ${formatDate(
                data.tanggalLahirAyah
              )}`}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-medium mb-5">Keterangan Ibu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Nama" value={data.namaIbu} />
            <SemiField
              label="Jenis Kelamin"
              value={data.jenisKelaminIbu === "L" ? "Laki-laki" : "Perempuan"}
            />
            <SemiField
              label="Alamat"
              value={getAlamat(data.kampungIbu, data.rtIbu, data.rwIbu)}
            />
            <SemiField label="Agama" value={data.agamaIbu} />
            <SemiField
              label="Tempat tanggal lahir"
              value={`${data.tempatLahirIbu}, ${formatDate(
                data.tanggalLahirIbu
              )}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowData;
