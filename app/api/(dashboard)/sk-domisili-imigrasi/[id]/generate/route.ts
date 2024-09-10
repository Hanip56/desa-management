import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { generateSkDomisiliImigrasi } from "@/services/sk-domisili-imigrasi-generate";
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
    const skDomisiliImigrasi = await prisma.skDomisiliImigrasi.findUnique({
      where: { id: params.id },
    });

    if (!skDomisiliImigrasi) {
      return new NextResponse("Surat keterangan domisili imigrasi not found", {
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
    if (skDomisiliImigrasi.status !== "DITERIMA") {
      return new NextResponse(
        "Surat keterangan domisili imigrasi status must be 'DITERIMA'",
        {
          status: 400,
        }
      );
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "content-disposition":
        "attachment;filename=surat_keterangan_domisili_imigrasi.pdf",
    });

    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();

    generateSkDomisiliImigrasi(
      skDomisiliImigrasi,
      (chunk) => writer.write(chunk),
      () => writer.close(),
      setting?.namaKepalaDesa,
      tte8,
      setting?.namaCamat
    );

    return new NextResponse(readable, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.log("[GENERATE_SK-DOMISILI-IMIGRASI]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
