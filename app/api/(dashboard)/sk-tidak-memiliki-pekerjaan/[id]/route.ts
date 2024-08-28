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
    const skTidakMemilikiPekerjaan =
      await prisma.skTidakMemilikiPekerjaan.findUnique({
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

    if (!skTidakMemilikiPekerjaan) {
      return new NextResponse(
        "Surat keterangan tidak memiliki pekerjaan not found",
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      ...skTidakMemilikiPekerjaan,
      User: undefined,
      user: skTidakMemilikiPekerjaan.User,
    });
  } catch (error) {
    console.log("[GET_ONE_SK-TIDAK-MEMILIKI-PEKERJAAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE sk-tidak-memiliki-pekerjaan
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skTidakMemilikiPekerjaan =
      await prisma.skTidakMemilikiPekerjaan.findUnique({
        where: { id: params.id },
      });

    if (!skTidakMemilikiPekerjaan) {
      return new NextResponse(
        "Surat keterangan tidak memiliki pekerjaan not found",
        {
          status: 404,
        }
      );
    }

    // is it own or admin
    if (
      skTidakMemilikiPekerjaan.userId !== session.user.id &&
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

    const updatedSkTidakMemilikiPekerjaan =
      await prisma.skTidakMemilikiPekerjaan.update({
        where: { id: params.id },
        data: body,
      });

    return NextResponse.json(updatedSkTidakMemilikiPekerjaan);
  } catch (error) {
    console.log("[UPDATE_SK-TIDAK-MEMILIKI-PEKERJAAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE sk-tidak-memiliki-pekerjaan
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skTidakMemilikiPekerjaan =
      await prisma.skTidakMemilikiPekerjaan.findUnique({
        where: { id: params.id },
      });

    if (!skTidakMemilikiPekerjaan) {
      return new NextResponse(
        "Surat keterangan tidak memiliki pekerjaan not found",
        {
          status: 404,
        }
      );
    }

    // is it own or admin
    if (
      skTidakMemilikiPekerjaan.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (
      skTidakMemilikiPekerjaan.status === "DITERIMA" &&
      session.user.role === "USER"
    ) {
      return new NextResponse(
        "You cannot delete sk-tidak-memiliki-pekerjaan with status 'DITERMA'",
        { status: 400 }
      );
    }

    const deletedSkTidakMemilikiPekerjaan =
      await prisma.skTidakMemilikiPekerjaan.delete({
        where: { id: params.id },
      });

    return NextResponse.json({
      success: `Surat keterangan tidak memiliki pekerjaan with id:${deletedSkTidakMemilikiPekerjaan.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_SK-TIDAK-MEMILIKI-PEKERJAAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
