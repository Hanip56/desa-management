import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { generateSkIjinKeramaian } from "@/services/sk-ijin-keramaian-generate";
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
    const skIjinKeramaian = await prisma.skIjinKeramaian.findUnique({
      where: { id: params.id },
    });

    if (!skIjinKeramaian) {
      return new NextResponse("Surat keterangan ijin keramaian not found", {
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
    if (skIjinKeramaian.status !== "DITERIMA") {
      return new NextResponse(
        "Surat keterangan ijin keramaian status must be 'DITERIMA'",
        {
          status: 400,
        }
      );
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "content-disposition":
        "attachment;filename=surat_keterangan_ijin_keramaian.pdf",
    });

    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();

    generateSkIjinKeramaian(
      skIjinKeramaian,
      (chunk) => writer.write(chunk),
      () => writer.close(),
      setting?.namaKepalaDesa,
      tte8,
      setting?.namaBabinsa,
      `${setting?.pangkatBabinsa} NRP.${setting?.nrpBabinsa}`,
      setting?.namaBhabinkamtibmas,
      `${setting?.pangkatBhabinkamtibmas} NRP.${setting?.nrpBhabinkamtibmas}`
    );

    return new NextResponse(readable, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.log("[GENERATE_SURAT-KEMATIAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
