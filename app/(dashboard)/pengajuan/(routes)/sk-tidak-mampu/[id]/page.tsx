import Header from "@/app/(dashboard)/components/header";
import ClientComp from "./components/client-comp";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { getSignedUrl } from "@/lib/server-utils";

const DynamicPage = async ({ params }: { params: { id: string } }) => {
  const session = await auth();
  let initialData: any;
  let skTidakMampu = await prisma.skTidakMampu.findUnique({
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

  if (skTidakMampu) {
    initialData = {
      ...skTidakMampu,
      User: undefined,
      user: {
        ...skTidakMampu.User,
        ktpUrl:
          skTidakMampu.User.ktpUrl && session?.user.role !== "USER"
            ? getSignedUrl(skTidakMampu.User.ktpUrl)
            : undefined,
        kkUrl:
          skTidakMampu.User.kkUrl && session?.user.role !== "USER"
            ? getSignedUrl(skTidakMampu.User.kkUrl)
            : undefined,
      },
    };
  }

  return (
    <main className="max-w-screen-lg mx-auto">
      <Header
        title={`Formulir Sk Tidak Mampu`}
        className="text-center"
        withBreadcrumb
        breadcrumbClassName="flex justify-center"
      />

      <ClientComp initialData={initialData} />
    </main>
  );
};

export default DynamicPage;
