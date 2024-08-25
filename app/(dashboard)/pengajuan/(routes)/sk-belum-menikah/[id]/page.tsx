import Header from "@/app/(dashboard)/components/header";
import ClientComp from "./components/client-comp";
import prisma from "@/db/prisma";

const DynamicPage = async ({ params }: { params: { id: string } }) => {
  let initialData: any;
  let skBelumMenikah = await prisma.skBelumMenikah.findUnique({
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

  if (skBelumMenikah) {
    initialData = {
      ...skBelumMenikah,
      User: undefined,
      user: skBelumMenikah.User,
    };
  }

  return (
    <main className="max-w-screen-lg mx-auto">
      <Header
        title={`Formulir SK Belum Menikah`}
        className="text-center"
        withBreadcrumb
        breadcrumbClassName="flex justify-center"
      />

      <ClientComp initialData={initialData} />
    </main>
  );
};

export default DynamicPage;
