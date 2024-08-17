import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET DASHBOARD PENGAJUAN
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const suratKelahiranMasuk = await prisma.suratKelahiran.count();
    const suratKematianMasuk = await prisma.suratKematian.count();
    const skBelumMenikahMasuk = await prisma.skBelumMenikah.count();
    const skPenghasilanOrangTuaMasuk =
      await prisma.skPenghasilanOrangTua.count();
    const skIjinKeramaianMasuk = await prisma.skIjinKeramaian.count();

    const suratKelahiranDiterima = await prisma.suratKelahiran.count({
      where: { status: "DITERIMA" },
    });
    const suratKematianDiterima = await prisma.suratKematian.count({
      where: { status: "DITERIMA" },
    });
    const skBelumMenikahDiterima = await prisma.skBelumMenikah.count({
      where: { status: "DITERIMA" },
    });
    const skPenghasilanOrangTuaDiterima =
      await prisma.skPenghasilanOrangTua.count({
        where: { status: "DITERIMA" },
      });
    const skIjinKeramaianDiterima = await prisma.skIjinKeramaian.count({
      where: { status: "DITERIMA" },
    });

    const suratKelahiranDitolak = await prisma.suratKelahiran.count({
      where: { status: "DITOLAK" },
    });
    const suratKematianDitolak = await prisma.suratKematian.count({
      where: { status: "DITOLAK" },
    });
    const skBelumMenikahDitolak = await prisma.skBelumMenikah.count({
      where: { status: "DITOLAK" },
    });
    const skPenghasilanOrangTuaDitolak =
      await prisma.skPenghasilanOrangTua.count({
        where: { status: "DITOLAK" },
      });
    const skIjinKeramaianDitolak = await prisma.skIjinKeramaian.count({
      where: { status: "DITOLAK" },
    });

    const jumlahSuratMasuk =
      suratKelahiranMasuk +
      suratKematianMasuk +
      skBelumMenikahMasuk +
      skPenghasilanOrangTuaMasuk +
      skIjinKeramaianMasuk;
    const jumlahSuratDiterima =
      suratKelahiranDiterima +
      suratKematianDiterima +
      skBelumMenikahDiterima +
      skPenghasilanOrangTuaDiterima +
      skIjinKeramaianDiterima;
    const jumlahSuratDitolak =
      suratKelahiranDitolak +
      suratKematianDitolak +
      skBelumMenikahDitolak +
      skPenghasilanOrangTuaDitolak +
      skIjinKeramaianDitolak;

    return NextResponse.json({
      suratKelahiranMasuk,
      suratKematianMasuk,
      skBelumMenikahMasuk,
      skPenghasilanOrangTuaMasuk,
      skIjinKeramaianMasuk,
      jumlahSuratDiterima,
      jumlahSuratMasuk,
      jumlahSuratDitolak,
    });
  } catch (error) {
    console.log("[GET_DASHBOARD-PENGAJUAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
