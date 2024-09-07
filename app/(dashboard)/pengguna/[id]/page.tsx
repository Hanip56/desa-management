import Header from "@/app/(dashboard)/components/header";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { getSignedUrl } from "@/lib/server-utils";
import InsertComp from "./components/insert-comp";
import { redirect } from "next/navigation";
import ShowData from "./components/show-data";

const DynamicPage = async ({ params }: { params: { id: string } }) => {
  const session = await auth();

  let initialData: any;
  let user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (user) {
    initialData = {
      ...user,
      ktpUrl:
        user.ktpUrl && session?.user.role !== "USER"
          ? getSignedUrl(user.ktpUrl)
          : undefined,
      kkUrl:
        user.kkUrl && session?.user.role !== "USER"
          ? getSignedUrl(user.kkUrl)
          : undefined,
    };
  }

  if (session?.user.role !== "SUPERADMIN" && !initialData) {
    redirect("/pengguna");
  }

  return (
    <main className="max-w-screen-lg mx-auto">
      <Header
        title={`Formulir membuat user`}
        className="text-center"
        withBreadcrumb
        breadcrumbClassName="flex justify-center"
      />

      {initialData ? <ShowData data={initialData} /> : <InsertComp />}
    </main>
  );
};

export default DynamicPage;
