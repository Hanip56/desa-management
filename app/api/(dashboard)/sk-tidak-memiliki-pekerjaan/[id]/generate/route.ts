import prisma from "@/db/prisma";
import { generateSkTidakMemilikiPekerjaan } from "@/services/sk-tidak-memiliki-pekerjaan-generate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const skTidakMemilikiPekerjaan =
      await prisma.skTidakMemilikiPekerjaan.findUnique({
        where: { id: params.id },
      });

    if (!skTidakMemilikiPekerjaan) {
      return new NextResponse(
        "Surat keterangan tidak memiliki pekerjaan not found",
        {
          status: 404,
        }
      );
    }

    const setting = await prisma.setting.findFirst();

    let tte8: Uint8Array | undefined = undefined;

    if (setting?.tte) {
      const bufferTte = Buffer.from(setting?.tte);
      tte8 = new Uint8Array(bufferTte);
    }

    // Check status surat-kematian
    if (skTidakMemilikiPekerjaan.status !== "DITERIMA") {
      return new NextResponse(
        "Surat keterangan tidak memiliki pekerjaan status must be 'DITERIMA'",
        {
          status: 400,
        }
      );
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "content-disposition":
        "attachment;filename=surat_keterangan_tidak_memiliki_pekerjaan.pdf",
    });

    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();

    generateSkTidakMemilikiPekerjaan(
      skTidakMemilikiPekerjaan,
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
    console.log("[GENERATE_SURAT-BELUM-MEMILIKI-RUMAH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
