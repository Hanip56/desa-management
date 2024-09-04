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
    const skPenghasilanOrangTua = await prisma.skPenghasilanOrangTua.findUnique(
      {
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
      }
    );

    if (!skPenghasilanOrangTua) {
      return new NextResponse(
        "Surat keterangan penghasilan orang tua not found",
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      ...skPenghasilanOrangTua,
      User: undefined,
      user: skPenghasilanOrangTua.User,
    });
  } catch (error) {
    console.log("[GET_ONE_SK-IJIN-KERAMAIAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE sk-penghasilan-orang-tua
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
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

    // is it own or admin
    if (
      skPenghasilanOrangTua.userId !== session.user.id &&
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

    const updatedSkPenghasilanOrangTua =
      await prisma.skPenghasilanOrangTua.update({
        where: { id: params.id },
        data: body,
      });

    return NextResponse.json(updatedSkPenghasilanOrangTua);
  } catch (error) {
    console.log("[UPDATE_SK-IJIN-KERAMAIAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE sk-penghasilan-orang-tua
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
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

    // is it own or admin
    if (
      skPenghasilanOrangTua.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (
      skPenghasilanOrangTua.status === "DITERIMA" &&
      session.user.role === "USER"
    ) {
      return new NextResponse(
        "You cannot delete sk-penghasilan-orang-tua with status 'DITERIMA'",
        { status: 400 }
      );
    }

    const deletedSkPenghasilanOrangTua =
      await prisma.skPenghasilanOrangTua.delete({
        where: { id: params.id },
      });

    return NextResponse.json({
      success: `Surat keterangan penghasilan orang tua with id:${deletedSkPenghasilanOrangTua.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_SK-IJIN-KERAMAIAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
