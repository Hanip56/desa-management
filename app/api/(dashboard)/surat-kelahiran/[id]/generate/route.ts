import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { generateSk } from "@/services/sk-pdflib";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const suratKelahiran = await prisma.suratKelahiran.findUnique({
      where: { id: params.id },
    });

    if (!suratKelahiran) {
      return new NextResponse("Surat Kelahiran not found", { status: 404 });
    }

    if (
      session.user.id !== suratKelahiran.userId &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

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

    generateSk(
      suratKelahiran,
      (chunk) => writer.write(chunk),
      () => writer.close()
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
