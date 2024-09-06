import Header from "@/app/(dashboard)/components/header";
import ClientComp from "./components/client-comp";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { getSignedUrl } from "@/lib/server-utils";

const DynamicPage = async ({ params }: { params: { id: string } }) => {
  const session = await auth();
  let initialData: any;
  let pendaftaranPindahWni = await prisma.pendaftaranPindahWni.findUnique({
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
      anggotaPindah: true,
    },
  });

  if (pendaftaranPindahWni) {
    initialData = {
      ...pendaftaranPindahWni,
      User: undefined,
      user: {
        ...pendaftaranPindahWni.User,
        ktpUrl:
          pendaftaranPindahWni.User.ktpUrl && session?.user.role !== "USER"
            ? getSignedUrl(pendaftaranPindahWni.User.ktpUrl)
            : undefined,
        kkUrl:
          pendaftaranPindahWni.User.kkUrl && session?.user.role !== "USER"
            ? getSignedUrl(pendaftaranPindahWni.User.kkUrl)
            : undefined,
      },
    };
  }

  return (
    <main className="max-w-screen-lg mx-auto">
      <Header
        title={`Formulir Pendaftaran Pindah WNI`}
        className="text-center"
        withBreadcrumb
        breadcrumbClassName="flex justify-center"
      />

      <ClientComp initialData={initialData} />
    </main>
  );
};

export default DynamicPage;
