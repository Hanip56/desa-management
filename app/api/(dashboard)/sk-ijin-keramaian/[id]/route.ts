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
  "namaBhabinkamtibmas",
  "jabatanNrpBhabinkamtibmas",
  "namaBabinsa",
  "jabatanNrpBabinsa",
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
    const skIjinKeramaian = await prisma.skIjinKeramaian.findUnique({
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

    if (!skIjinKeramaian) {
      return new NextResponse("Surat keterangan ijin keramaian not found", {
        status: 400,
      });
    }

    return NextResponse.json({
      ...skIjinKeramaian,
      User: undefined,
      user: skIjinKeramaian.User,
    });
  } catch (error) {
    console.log("[GET_ONE_SK-IJIN-KERAMAIAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE sk-ijin-keramaian
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skIjinKeramaian = await prisma.skIjinKeramaian.findUnique({
      where: { id: params.id },
    });

    if (!skIjinKeramaian) {
      return new NextResponse("Surat keterangan ijin keramaian not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skIjinKeramaian.userId !== session.user.id &&
      session.user.role === "USER"
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

    const updatedSkIjinKeramaian = await prisma.skIjinKeramaian.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedSkIjinKeramaian);
  } catch (error) {
    console.log("[UPDATE_SK-IJIN-KERAMAIAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE sk-ijin-keramaian
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skIjinKeramaian = await prisma.skIjinKeramaian.findUnique({
      where: { id: params.id },
    });

    if (!skIjinKeramaian) {
      return new NextResponse("Surat keterangan ijin keramaian not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skIjinKeramaian.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (skIjinKeramaian.status === "DITERIMA" && session.user.role === "USER") {
      return new NextResponse(
        "You cannot delete sk-ijin-keramaian with status 'DITERIMA'",
        { status: 400 }
      );
    }

    const deletedSkIjinKeramaian = await prisma.skIjinKeramaian.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: `Surat keterangan ijin keramaian with id:${deletedSkIjinKeramaian.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_SK-IJIN-KERAMAIAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
