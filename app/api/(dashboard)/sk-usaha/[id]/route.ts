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
    const skUsaha = await prisma.skUsaha.findUnique({
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

    if (!skUsaha) {
      return new NextResponse("Surat keterangan usaha not found", {
        status: 400,
      });
    }

    return NextResponse.json({
      ...skUsaha,
      User: undefined,
      user: skUsaha.User,
    });
  } catch (error) {
    console.log("[GET_ONE_SK-USAHA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE sk-usaha
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skUsaha = await prisma.skUsaha.findUnique({
      where: { id: params.id },
    });

    if (!skUsaha) {
      return new NextResponse("Surat keterangan usaha not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (skUsaha.userId !== session.user.id && session.user.role === "USER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();

    // disabled some field when update
    if (session.user.role === "USER") {
      disabledUpdateField.map((field) => {
        if (body?.[field]) body[field] = undefined;
      });
    }

    const updatedSkUsaha = await prisma.skUsaha.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedSkUsaha);
  } catch (error) {
    console.log("[UPDATE_SK-USAHA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE sk-usaha
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skUsaha = await prisma.skUsaha.findUnique({
      where: { id: params.id },
    });

    if (!skUsaha) {
      return new NextResponse("Surat keterangan usaha not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (skUsaha.userId !== session.user.id && session.user.role === "USER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (skUsaha.status === "DITERIMA" && session.user.role === "USER") {
      return new NextResponse(
        "You cannot delete sk-usaha with status 'DITERMA'",
        { status: 400 }
      );
    }

    const deletedSkUsaha = await prisma.skUsaha.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: `Surat keterangan usaha with id:${deletedSkUsaha.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_SK-USAHA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
