import Header from "@/app/(dashboard)/components/header";
import ClientComp from "./components/client-comp";
import prisma from "@/db/prisma";
import { getUrl } from "@/lib/server-utils";
import { auth } from "@/auth";

const DynamicPage = async ({ params }: { params: { id: string } }) => {
  const session = await auth();
  let initialData: any;
  let skDomisiliSementara = await prisma.skDomisiliSementara.findUnique({
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

  if (skDomisiliSementara) {
    initialData = {
      ...skDomisiliSementara,
      User: undefined,
      user: {
        ...skDomisiliSementara.User,
        ktpUrl:
          skDomisiliSementara.User.ktpUrl && session?.user.role !== "USER"
            ? getUrl(skDomisiliSementara.User.ktpUrl, "ktp")
            : undefined,
        kkUrl:
          skDomisiliSementara.User.kkUrl && session?.user.role !== "USER"
            ? getUrl(skDomisiliSementara.User.kkUrl, "kk")
            : undefined,
      },
    };
  }

  return (
    <main className="max-w-screen-lg mx-auto">
      <Header
        title={`Formulir Sk Domisili Sementara`}
        className="text-center"
        withBreadcrumb
        breadcrumbClassName="flex justify-center"
      />

      <ClientComp initialData={initialData} />
    </main>
  );
};

export default DynamicPage;
