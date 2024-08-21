import prisma from "@/db/prisma";
import { generateSuratKelahiran } from "@/services/surat-kelahiran-generate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const suratKelahiran = await prisma.suratKelahiran.findUnique({
      where: { id: params.id },
    });

    if (!suratKelahiran) {
      return new NextResponse("Surat Kelahiran not found", { status: 404 });
    }

    const setting = await prisma.setting.findFirst();

    // Check status surat-kelahiran
    if (suratKelahiran.status !== "DITERIMA") {
      return new NextResponse("Surat Kelahiran status must be 'DITERIMA'", {
        status: 400,
      });
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "content-disposition": "attachment;filename=surat_kelahiran.pdf",
    });

    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();

    let tte8: Uint8Array | undefined = undefined;

    if (setting?.tte) {
      const bufferTte = Buffer.from(setting?.tte);
      tte8 = new Uint8Array(bufferTte);
    }

    generateSuratKelahiran(
      suratKelahiran,
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
    console.log("[GENERATE_SURAT-KELAHIRAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
