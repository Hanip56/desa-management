import SemiField from "@/components/semi-field";
import { formatDate } from "@/lib/utils";
import { SkDomisiliLembagaWithUser } from "@/types";

type Props = {
  data: SkDomisiliLembagaWithUser;
};

const ShowData = ({ data }: Props) => {
  return (
    <div className="sm:p-6 sm:border">
      <div className="p-4 bg-muted">
        <h2 className="text-center text-lg font-semibold">Data Formulir</h2>
      </div>
      <div className="flex flex-col gap-y-10 md:gap-y-12 pt-6">
        {/* keterangan pemohon */}
        <div>
          <h2 className="text-xl font-medium mb-5">Keterangan pemohon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Nama" value={data.nama} />
            <SemiField label="Tempat lahir" value={data.tempatLahir} />
            <SemiField
              label="Tanggal Lahir"
              value={formatDate(data.tanggalLahir)}
            />
            <SemiField label="jabatan" value={data.jabatan} />
          </div>
        </div>
        {/* keterangan lembaga */}
        <div>
          <h2 className="text-xl font-medium mb-5">Keterangan lembaga</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <SemiField label="Nama lembaga" value={data.alamat} />
            <SemiField label="Alamat lembaga" value={data.alamat} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowData;
