import Header from "@/app/(dashboard)/components/header";
import ClientComp from "./components/client-comp";
import prisma from "@/db/prisma";

const DynamicPage = async ({ params }: { params: { id: string } }) => {
  let initialData: any;
  let suratKematian = await prisma.suratKematian.findUnique({
    where: { id: params.id },
    include: {
      User: {
        select: {
          id: true,
          username: true,
          nomorWa: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (suratKematian) {
    initialData = {
      ...suratKematian,
      User: undefined,
      user: suratKematian.User,
    };
  }

  return (
    <main className="max-w-screen-lg mx-auto">
      <Header
        title={`Formulir Surat Kematian`}
        className="text-center"
        withBreadcrumb
        breadcrumbClassName="flex justify-center"
      />

      <ClientComp initialData={initialData} />
    </main>
  );
};

export default DynamicPage;
