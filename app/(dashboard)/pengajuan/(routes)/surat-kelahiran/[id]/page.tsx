import Header from "@/app/(dashboard)/components/header";
import ClientComp from "./components/client-comp";
import prisma from "@/db/prisma";

const DynamicPage = async ({ params }: { params: { id: string } }) => {
  let initialData: any;
  let suratKelahiran = await prisma.suratKelahiran.findUnique({
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

  if (suratKelahiran) {
    initialData = {
      ...suratKelahiran,
      User: undefined,
      user: suratKelahiran.User,
    };
  }

  return (
    <main className="max-w-screen-lg mx-auto">
      <Header
        title={`Formulir Surat Kelahiran`}
        className="text-center"
        withBreadcrumb
        breadcrumbClassName="flex justify-center"
      />

      <ClientComp initialData={initialData} />
    </main>
  );
};

export default DynamicPage;
