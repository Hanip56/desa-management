import Header from "@/app/(dashboard)/components/header";
import ClientComp from "./components/client-comp";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { getUrl } from "@/lib/server-utils";

const DynamicPage = async ({ params }: { params: { id: string } }) => {
  const session = await auth();
  let initialData: any;
  let skIzinBekerja = await prisma.skIzinBekerja.findUnique({
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

  if (skIzinBekerja) {
    initialData = {
      ...skIzinBekerja,
      User: undefined,
      user: {
        ...skIzinBekerja.User,
        ktpUrl:
          skIzinBekerja.User.ktpUrl && session?.user.role !== "USER"
            ? getUrl(skIzinBekerja.User.ktpUrl, "ktp")
            : undefined,
        kkUrl:
          skIzinBekerja.User.kkUrl && session?.user.role !== "USER"
            ? getUrl(skIzinBekerja.User.kkUrl, "kk")
            : undefined,
      },
    };
  }

  return (
    <main className="max-w-screen-lg mx-auto">
      <Header
        title={`Formulir SK Izin Bekerja`}
        className="text-center"
        withBreadcrumb
        breadcrumbClassName="flex justify-center"
      />

      <ClientComp initialData={initialData} />
    </main>
  );
};

export default DynamicPage;
