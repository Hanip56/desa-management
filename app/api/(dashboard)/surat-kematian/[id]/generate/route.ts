import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { generateSuratKematian } from "@/services/surat-kematian-generate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const suratKematian = await prisma.suratKematian.findUnique({
      where: { id: params.id },
    });

    const setting = await prisma.setting.findFirst();

    let tte8: Uint8Array | undefined = undefined;

    if (setting?.tte) {
      const bufferTte = Buffer.from(setting?.tte);
      tte8 = new Uint8Array(bufferTte);
    }

    if (!suratKematian) {
      return new NextResponse("Surat Kematian not found", { status: 404 });
    }

    if (
      session.user.id !== suratKematian.userId &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Check status surat-kematian
    if (suratKematian.status !== "DITERIMA") {
      return new NextResponse("Surat Kematian status must be 'DITERIMA'", {
        status: 400,
      });
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "content-disposition": "attachment;filename=surat_kematian.pdf",
    });

    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();

    generateSuratKematian(
      suratKematian,
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
