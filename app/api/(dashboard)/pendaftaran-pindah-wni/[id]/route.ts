import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { AnggotaPindahWni } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const disabledUpdateField = [
  "id",
  "userId",
  "createdAt",
  "updatedAt",
  "status",
  "pesanDitolak",
  "noSurat",
  "tanggalPembuatan",
];

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const pendaftaranPindahWni = await prisma.pendaftaranPindahWni.findUnique({
      where: { id: params.id },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            nomorWa: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        anggotaPindah: true,
      },
    });

    if (!pendaftaranPindahWni) {
      return new NextResponse("Formulir pendaftaran pindah wni not found", {
        status: 400,
      });
    }

    return NextResponse.json({
      ...pendaftaranPindahWni,
      User: undefined,
      user: pendaftaranPindahWni.User,
    });
  } catch (error) {
    console.log("[GET_ONE_PENDAFTARAN-PINDAH-WNI]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE pendaftaran-pindah-wni
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const pendaftaranPindahWni = await prisma.pendaftaranPindahWni.findUnique({
      where: { id: params.id },
    });

    if (!pendaftaranPindahWni) {
      return new NextResponse("Formulir pendaftaran pindah wni not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      pendaftaranPindahWni.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // if status 'diterima' user cannot edit
    if (
      session.user.role === "USER" &&
      pendaftaranPindahWni.status === "DITERIMA"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();

    // disabled some field when update
    if (session.user.role === "USER") {
      disabledUpdateField.map((field) => {
        if (body?.[field]) body[field] = undefined;
      });
    }

    const updatedPendaftaranPindahWni =
      await prisma.pendaftaranPindahWni.update({
        where: { id: params.id },
        data: {
          ...body,
          anggotaPindah: undefined,
        },
      });

    if (body.anggotaPindah) {
      await prisma.anggotaPindahWni.deleteMany({
        where: {
          pendaftaranPindahWniId: updatedPendaftaranPindahWni.id,
        },
      });

      await prisma.anggotaPindahWni.createMany({
        data: body.anggotaPindah.map((anggota: AnggotaPindahWni) => ({
          ...anggota,
          pendaftaranPindahWniId: updatedPendaftaranPindahWni.id,
        })),
      });
    }

    return NextResponse.json(updatedPendaftaranPindahWni);
  } catch (error) {
    console.log("[UPDATE_PENDAFTARAN-PINDAH-WNI]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE pendaftaran-pindah-wni
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const pendaftaranPindahWni = await prisma.pendaftaranPindahWni.findUnique({
      where: { id: params.id },
    });

    if (!pendaftaranPindahWni) {
      return new NextResponse("Formulir pendaftaran pindah wni not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      pendaftaranPindahWni.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (
      pendaftaranPindahWni.status === "DITERIMA" &&
      session.user.role === "USER"
    ) {
      return new NextResponse(
        "You cannot delete pendaftaran-pindah-wni with status 'DITERIMA'",
        { status: 400 }
      );
    }

    const deletedPendaftaranPindahWni =
      await prisma.pendaftaranPindahWni.delete({
        where: { id: params.id },
      });

    return NextResponse.json({
      success: `Formulir pendaftaran pindah wni with id:${deletedPendaftaranPindahWni.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_PENDAFTARAN-PINDAH-WNI]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
