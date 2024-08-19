import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { generateSkPenghasilanOrangTua } from "@/services/sk-penghasilan-orang-tua-generate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const skPenghasilanOrangTua = await prisma.skPenghasilanOrangTua.findUnique(
      {
        where: { id: params.id },
      }
    );

    if (!skPenghasilanOrangTua) {
      return new NextResponse(
        "Surat keterangan penghasilan orang tua not found",
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

    if (
      session.user.id !== skPenghasilanOrangTua.userId &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Check status surat-kematian
    if (skPenghasilanOrangTua.status !== "DITERIMA") {
      return new NextResponse(
        "Surat keterangan penghasilan orang tua status must be 'DITERIMA'",
        {
          status: 400,
        }
      );
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "content-disposition":
        "attachment;filename=surat_keterangan_penghasilan_orang_tua.pdf",
    });

    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();

    generateSkPenghasilanOrangTua(
      skPenghasilanOrangTua,
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
