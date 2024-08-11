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
    const skBelumMenikah = await prisma.skBelumMenikah.findUnique({
      where: { id: params.id },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!skBelumMenikah) {
      return new NextResponse("Surat keterangan belum menikah not found", {
        status: 400,
      });
    }

    return NextResponse.json({
      ...skBelumMenikah,
      User: undefined,
      user: skBelumMenikah.User,
    });
  } catch (error) {
    console.log("[GET_ONE_SK-BELUM-MENIKAH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE sk-belum-menikah
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skBelumMenikah = await prisma.skBelumMenikah.findUnique({
      where: { id: params.id },
    });

    if (!skBelumMenikah) {
      return new NextResponse("Surat keterangan belum menikah not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skBelumMenikah.userId !== session.user.id &&
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

    const updatedSkBelumMenikah = await prisma.skBelumMenikah.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedSkBelumMenikah);
  } catch (error) {
    console.log("[UPDATE_SK-BELUM-MENIKAH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE sk-belum-menikah
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skBelumMenikah = await prisma.skBelumMenikah.findUnique({
      where: { id: params.id },
    });

    if (!skBelumMenikah) {
      return new NextResponse("Surat keterangan belum menikah not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skBelumMenikah.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (skBelumMenikah.status === "DITERIMA" && session.user.role === "USER") {
      return new NextResponse(
        "You cannot delete surat kematian with status 'DITERMA'",
        { status: 400 }
      );
    }

    const deletedSkBelumMenikah = await prisma.skBelumMenikah.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: `Surat keterangan belum menikah with id:${deletedSkBelumMenikah.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_SK-BELUM-MENIKAH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
