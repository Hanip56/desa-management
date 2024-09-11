import Header from "@/app/(dashboard)/components/header";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { getUrl } from "@/lib/server-utils";
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
          ? getUrl(user.ktpUrl, "ktp")
          : undefined,
      kkUrl:
        user.kkUrl && session?.user.role !== "USER"
          ? getUrl(user.kkUrl, "kk")
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
