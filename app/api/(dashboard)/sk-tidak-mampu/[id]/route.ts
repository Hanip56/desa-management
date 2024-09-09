import { auth } from "@/auth";
import prisma from "@/db/prisma";
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
    const skTidakMampu = await prisma.skTidakMampu.findUnique({
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
      },
    });

    if (!skTidakMampu) {
      return new NextResponse("Surat keterangan tidak mampu not found", {
        status: 400,
      });
    }

    return NextResponse.json({
      ...skTidakMampu,
      User: undefined,
      user: skTidakMampu.User,
    });
  } catch (error) {
    console.log("[GET_ONE_SK-TIDAK-MAMPU]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE sk-tidak-mampu
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skTidakMampu = await prisma.skTidakMampu.findUnique({
      where: { id: params.id },
    });

    if (!skTidakMampu) {
      return new NextResponse("Surat keterangan tidak mampu not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skTidakMampu.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // if status 'diterima' user cannot edit
    if (session.user.role === "USER" && skTidakMampu.status === "DITERIMA") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();

    // disabled some field when update
    if (session.user.role === "USER") {
      disabledUpdateField.map((field) => {
        if (body?.[field]) body[field] = undefined;
      });
    }

    const updatedSkTidakMampu = await prisma.skTidakMampu.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedSkTidakMampu);
  } catch (error) {
    console.log("[UPDATE_SK-TIDAK-MAMPU]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE sk-tidak-mampu
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skTidakMampu = await prisma.skTidakMampu.findUnique({
      where: { id: params.id },
    });

    if (!skTidakMampu) {
      return new NextResponse("Surat keterangan tidak mampu not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skTidakMampu.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (skTidakMampu.status === "DITERIMA" && session.user.role === "USER") {
      return new NextResponse(
        "You cannot delete sk-tidak-mampu with status 'DITERIMA'",
        { status: 400 }
      );
    }

    const deletedSkTidakMampu = await prisma.skTidakMampu.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: `Surat keterangan tidak mampu with id:${deletedSkTidakMampu.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_SK-TIDAK-MAMPU]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
