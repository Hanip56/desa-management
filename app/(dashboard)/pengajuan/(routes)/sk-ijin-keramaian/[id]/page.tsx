import Header from "@/app/(dashboard)/components/header";
import ClientComp from "./components/client-comp";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { getUrl } from "@/lib/server-utils";
import { DateToDayAndDate, DatetoTime } from "@/lib/utils";

const DynamicPage = async ({ params }: { params: { id: string } }) => {
  const session = await auth();
  let initialData: any;
  let skIjinKeramaian = await prisma.skIjinKeramaian.findUnique({
    where: { id: params.id },
    include: {
      User: {
        select: {
          id: true,
          username: true,
          nomorWa: true,
          role: true,
          ktpUrl: true,
          kkUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (skIjinKeramaian) {
    initialData = {
      ...skIjinKeramaian,
      User: undefined,
      user: {
        ...skIjinKeramaian.User,
        ktpUrl:
          skIjinKeramaian.User.ktpUrl && session?.user.role !== "USER"
            ? getUrl(skIjinKeramaian.User.ktpUrl, "ktp")
            : undefined,
        kkUrl:
          skIjinKeramaian.User.kkUrl && session?.user.role !== "USER"
            ? getUrl(skIjinKeramaian.User.kkUrl, "kk")
            : undefined,
      },
    };
  }

  let formatTanggal = "";
  let formatWaktu = "";

  if (initialData) {
    formatTanggal = DateToDayAndDate(initialData.waktu);
    formatWaktu = DatetoTime(initialData.waktu);
  }

  return (
    <main className="max-w-screen-lg mx-auto">
      <Header
        title={`Formulir SK Ijin Keramaian`}
        className="text-center"
        withBreadcrumb
        breadcrumbClassName="flex justify-center"
      />

      <ClientComp initialData={initialData} />
    </main>
  );
};

export default DynamicPage;
