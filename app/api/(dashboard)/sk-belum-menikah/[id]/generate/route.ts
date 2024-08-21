import prisma from "@/db/prisma";
import { generateSkBelumMenikah } from "@/services/sk-belum-menikah-generate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const skBelumMenikah = await prisma.skBelumMenikah.findUnique({
      where: { id: params.id },
    });

    if (!skBelumMenikah) {
      return new NextResponse("Surat keterangan belum menikah not found", {
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
    if (skBelumMenikah.status !== "DITERIMA") {
      return new NextResponse(
        "Surat keterangan belum menikah status must be 'DITERIMA'",
        {
          status: 400,
        }
      );
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "content-disposition":
        "attachment;filename=surat_keterangan_belum_menikah.pdf",
    });

    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();

    generateSkBelumMenikah(
      skBelumMenikah,
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
    console.log("[GENERATE_SURAT-KEMATIAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
