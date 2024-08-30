import prisma from "@/db/prisma";
import { generateSkDomisiliLembaga } from "@/services/sk-domisili-lembaga-generate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const skDomisiliLembaga = await prisma.skDomisiliLembaga.findUnique({
      where: { id: params.id },
    });

    if (!skDomisiliLembaga) {
      return new NextResponse("Surat keterangan domisili lembaga not found", {
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
    if (skDomisiliLembaga.status !== "DITERIMA") {
      return new NextResponse(
        "Surat keterangan domisili lembaga status must be 'DITERIMA'",
        {
          status: 400,
        }
      );
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "content-disposition":
        "attachment;filename=surat_keterangan_domisili_lembaga.pdf",
    });

    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();

    generateSkDomisiliLembaga(
      skDomisiliLembaga,
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
    console.log("[GENERATE_SK-USAHA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
