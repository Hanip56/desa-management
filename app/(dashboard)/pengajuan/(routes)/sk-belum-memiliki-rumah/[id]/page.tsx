import Header from "@/app/(dashboard)/components/header";
import ClientComp from "./components/client-comp";
import prisma from "@/db/prisma";

const DynamicPage = async ({ params }: { params: { id: string } }) => {
  let initialData: any;
  let skBelumMemilikiRumah = await prisma.skBelumMemilikiRumah.findUnique({
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

  if (skBelumMemilikiRumah) {
    initialData = {
      ...skBelumMemilikiRumah,
      User: undefined,
      user: skBelumMemilikiRumah.User,
    };
  }

  return (
    <main className="max-w-screen-lg mx-auto">
      <Header
        title={`Formulir SK Belum Memiliki Rumah`}
        className="text-center"
        withBreadcrumb
        breadcrumbClassName="flex justify-center"
      />

      <ClientComp initialData={initialData} />
    </main>
  );
};

export default DynamicPage;
