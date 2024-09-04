import prisma from "@/db/prisma";
import { generatePendaftaranPindahWni } from "@/services/pendaftaran-pindah-wni-generate";
import { PendaftaranPindahWni } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pendaftaranPindahWni = await prisma.pendaftaranPindahWni.findUnique({
      where: { id: params.id },
      include: {
        anggotaPindah: true,
      },
    });

    if (!pendaftaranPindahWni) {
      return new NextResponse("Formulir pendaftaran pindah wni not found", {
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
    if (pendaftaranPindahWni.status !== "DITERIMA") {
      return new NextResponse(
        "Formulir pendaftaran pindah wni status must be 'DITERIMA'",
        {
          status: 400,
        }
      );
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "content-disposition":
        "attachment;filename=formulir_pendaftaran_pindah_wni.pdf",
    });

    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();

    generatePendaftaranPindahWni(
      pendaftaranPindahWni,
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
    console.log("[GENERATE_PENDAFTARAN-PINDAH-WNI]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
