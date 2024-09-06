import Header from "@/app/(dashboard)/components/header";
import ClientComp from "./components/client-comp";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { getSignedUrl } from "@/lib/server-utils";

const DynamicPage = async ({ params }: { params: { id: string } }) => {
  const session = await auth();
  let initialData: any;
  let skTidakMemilikiPekerjaan =
    await prisma.skTidakMemilikiPekerjaan.findUnique({
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

  if (skTidakMemilikiPekerjaan) {
    initialData = {
      ...skTidakMemilikiPekerjaan,
      User: undefined,
      user: {
        ...skTidakMemilikiPekerjaan.User,
        ktpUrl:
          skTidakMemilikiPekerjaan.User.ktpUrl && session?.user.role !== "USER"
            ? getSignedUrl(skTidakMemilikiPekerjaan.User.ktpUrl)
            : undefined,
        kkUrl:
          skTidakMemilikiPekerjaan.User.kkUrl && session?.user.role !== "USER"
            ? getSignedUrl(skTidakMemilikiPekerjaan.User.kkUrl)
            : undefined,
      },
    };
  }

  return (
    <main className="max-w-screen-lg mx-auto">
      <Header
        title={`Formulir SK Tidak Memiliki Pekerjaan`}
        className="text-center"
        withBreadcrumb
        breadcrumbClassName="flex justify-center"
      />

      <ClientComp initialData={initialData} />
    </main>
  );
};

export default DynamicPage;
