import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// UPDATE USER
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { username, nomorWa, password, oldPassword } = await req.json();

    if (params.id !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const user = await prisma.user.findUnique({ where: { id: params.id } });

    if (!user) return new NextResponse("User not found", { status: 404 });

    let hashPass;

    if (password) {
      if (!oldPassword) {
        return new NextResponse("Old password is required", { status: 400 });
      }

      const isMatchPassword = await bcrypt.compare(oldPassword, user.password);

      if (!isMatchPassword) {
        return new NextResponse("Old password is not valid", { status: 400 });
      }

      hashPass = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        username,
        nomorWa,
        password: hashPass,
      },
    });

    return NextResponse.json({ ...updatedUser, password: undefined });
  } catch (error) {
    console.log("[UPDATE_USER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE USER
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role === "USER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.role === "SUPERADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (user.role === session.user.role) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.user.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(`User with id:${params.id} has been deleted`, {
      status: 200,
    });
  } catch (error) {
    console.log("[DELETE_USER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
