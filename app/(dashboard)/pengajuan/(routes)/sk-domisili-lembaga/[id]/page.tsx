import Header from "@/app/(dashboard)/components/header";
import ClientComp from "./components/client-comp";
import prisma from "@/db/prisma";
import { getUrl } from "@/lib/server-utils";
import { auth } from "@/auth";

const DynamicPage = async ({ params }: { params: { id: string } }) => {
  const session = await auth();
  let initialData: any;
  let skDomisiliLembaga = await prisma.skDomisiliLembaga.findUnique({
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

  if (skDomisiliLembaga) {
    initialData = {
      ...skDomisiliLembaga,
      User: undefined,
      user: {
        ...skDomisiliLembaga.User,
        ktpUrl:
          skDomisiliLembaga.User.ktpUrl && session?.user.role !== "USER"
            ? getUrl(skDomisiliLembaga.User.ktpUrl, "ktp")
            : undefined,
        kkUrl:
          skDomisiliLembaga.User.kkUrl && session?.user.role !== "USER"
            ? getUrl(skDomisiliLembaga.User.kkUrl, "kk")
            : undefined,
      },
    };
  }

  return (
    <main className="max-w-screen-lg mx-auto">
      <Header
        title={`Formulir Sk Domisili Lembaga`}
        className="text-center"
        withBreadcrumb
        breadcrumbClassName="flex justify-center"
      />

      <ClientComp initialData={initialData} />
    </main>
  );
};

export default DynamicPage;
