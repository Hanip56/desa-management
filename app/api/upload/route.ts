import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { uploadFileToLocal } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const formData = await req.formData();
    const ktpFile = formData.get("ktpFile") as File | null;
    const kkFile = formData.get("kkFile") as File | null;

    if (!ktpFile || !kkFile) {
      return new NextResponse("No files provided", { status: 204 });
    }

    const [ktpUploadPath, kkUploadPath] = await Promise.all([
      uploadFileToLocal(ktpFile, "ktp", session.user.id),
      uploadFileToLocal(kkFile, "kk", session.user.id),
    ]);

    return NextResponse.json({ ktpUploadPath, kkUploadPath });
  } catch (error) {
    console.error("[PATCH_USER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
