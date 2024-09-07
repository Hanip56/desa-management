import ShowUserData from "@/app/(dashboard)/components/show-user-data";
import SemiField from "@/components/semi-field";
import { Card } from "@/components/ui/card";
import { User } from "@prisma/client";

type Props = {
  data: User;
};

const ShowData = ({ data }: Props) => {
  return (
    <Card className="mt-8 rounded-2xl p-8">
      {data.kkUrl && data.ktpUrl && (
        <ShowUserData
          kkUrl={data.kkUrl}
          ktpUrl={data.ktpUrl}
          title="Dokumen user"
        />
      )}
      <div className="sm:p-6 sm:border rounded-br-2xl rounded-bl-2xl mt-4">
        <div className="p-4 bg-muted">
          <h2 className="text-center text-lg font-semibold">Data User</h2>
        </div>
        <div className="flex flex-col gap-y-10 md:gap-y-12 pt-6">
          {/* keterangan pemohon */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
              <SemiField label="ID" value={data.id} />
              <SemiField label="Username" value={data.username} />
              <SemiField label="Nomor WA" value={data.nomorWa} />
              <SemiField label="ROLE" value={data.role} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ShowData;
