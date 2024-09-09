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
    const skDomisiliSementara = await prisma.skDomisiliSementara.findUnique({
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

    if (!skDomisiliSementara) {
      return new NextResponse("Surat keterangan domisili sementara not found", {
        status: 400,
      });
    }

    return NextResponse.json({
      ...skDomisiliSementara,
      User: undefined,
      user: skDomisiliSementara.User,
    });
  } catch (error) {
    console.log("[GET_ONE_SK-DOMISILI-SEMENTARA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE sk-domisili-sementara
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skDomisiliSementara = await prisma.skDomisiliSementara.findUnique({
      where: { id: params.id },
    });

    if (!skDomisiliSementara) {
      return new NextResponse("Surat keterangan domisili sementara not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skDomisiliSementara.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // if status 'diterima' user cannot edit
    if (
      session.user.role === "USER" &&
      skDomisiliSementara.status === "DITERIMA"
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

    const updatedSkDomisiliSementara = await prisma.skDomisiliSementara.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedSkDomisiliSementara);
  } catch (error) {
    console.log("[UPDATE_SK-DOMISILI-SEMENTARA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE sk-domisili-sementara
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skDomisiliSementara = await prisma.skDomisiliSementara.findUnique({
      where: { id: params.id },
    });

    if (!skDomisiliSementara) {
      return new NextResponse("Surat keterangan domisili sementara not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skDomisiliSementara.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (
      skDomisiliSementara.status === "DITERIMA" &&
      session.user.role === "USER"
    ) {
      return new NextResponse(
        "You cannot delete sk-domisili-sementara with status 'DITERIMA'",
        { status: 400 }
      );
    }

    const deletedSkDomisiliSementara = await prisma.skDomisiliSementara.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: `Surat keterangan domisili sementara with id:${deletedSkDomisiliSementara.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_SK-DOMISILI-SEMENTARA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
