import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { generateSuratRekomendasiPembelianBbm } from "@/services/surat-rekomendasi-pembelian-bbm-generate";
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
    const suratRekomendasiPembelianBbm =
      await prisma.suratRekomendasiPembelianBbm.findUnique({
        where: { id: params.id },
      });

    if (!suratRekomendasiPembelianBbm) {
      return new NextResponse("Surat rekomendasi pembelian  bbm not found", {
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
    if (suratRekomendasiPembelianBbm.status !== "DITERIMA") {
      return new NextResponse(
        "Surat rekomendasi pembelian  bbm status must be 'DITERIMA'",
        {
          status: 400,
        }
      );
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "content-disposition":
        "attachment;filename=surat_rekomendasi_pembelian_jenis_bbm_tertentu.pdf",
    });

    const { readable, writable } = new TransformStream();

    const writer = writable.getWriter();

    generateSuratRekomendasiPembelianBbm(
      suratRekomendasiPembelianBbm,
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
    console.log("[GENERATE_SURAT-REKOMENDASI-PEMBELIAN-BBM]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
