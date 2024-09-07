import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { generateSkDomisiliSementara } from "@/services/sk-domisili-sementara-generate";
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
    const skDomisiliSementara = await prisma.skDomisiliSementara.findUnique({
      where: { id: params.id },
    });

    if (!skDomisiliSementara) {
      return new NextResponse("Surat keterangan domisili sementara not found", {
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
    if (skDomisiliSementara.status !== "DITERIMA") {
      return new NextResponse(
        "Surat keterangan domisili sementara status must be 'DITERIMA'",
        {
          status: 400,
        }
      );
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "content-disposition":
        "attachment;filename=surat_keterangan_domisili_sementara.pdf",
    });

    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();

    generateSkDomisiliSementara(
      skDomisiliSementara,
      (chunk) => writer.write(chunk),
      () => writer.close(),
      setting?.namaKepalaDesa,
      tte8
    );

    return new NextResponse(readable, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.log("[GENERATE_SK-DOMISILI-SEMENTARA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
