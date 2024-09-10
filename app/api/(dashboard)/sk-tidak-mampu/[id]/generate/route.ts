import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { generateSkTidakMampu } from "@/services/sk-tidak-mampu-generate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const mobileAppSecret =
    req.nextUrl.searchParams.get("mobile-app-secret") || "";

  if (!session && mobileAppSecret !== process.env.MOBILE_APP_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const skTidakMampu = await prisma.skTidakMampu.findUnique({
      where: { id: params.id },
    });

    if (!skTidakMampu) {
      return new NextResponse("Surat keterangan tidak mampu not found", {
        status: 404,
      });
    }

    const setting = await prisma.setting.findFirst();

    let tte8: Uint8Array | undefined = undefined;

    if (setting?.tte) {
      const bufferTte = Buffer.from(setting?.tte);
      tte8 = new Uint8Array(bufferTte);
    }

    // Check status surat-kematian
    if (skTidakMampu.status !== "DITERIMA") {
      return new NextResponse(
        "Surat keterangan tidak mampu status must be 'DITERIMA'",
        {
          status: 400,
        }
      );
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "content-disposition":
        "attachment;filename=surat_keterangan_tidak_mampu.pdf",
    });

    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();

    generateSkTidakMampu(
      skTidakMampu,
      (chunk) => writer.write(chunk),
      () => writer.close(),
      setting?.namaKepalaDesa,
      tte8,
      setting?.namaCamat,
      setting?.noRegCamat
    );

    return new NextResponse(readable, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.log("[GENERATE_SK-TIDAK-MAMPU]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
