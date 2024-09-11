import { auth } from "@/auth";
import prisma from "@/db/prisma";
import {
  deleteMultipleFilesCloudinary,
  deleteMultipleLocalFiles,
  uploadFileToLocal,
} from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import path from "path";
import { cwd } from "process";

// GET ALL USERS
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role === "USER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 5;
    const search = req.nextUrl.searchParams.get("search") || "";
    const updatedAt = req.nextUrl.searchParams.get("updatedAt") || "desc";

    let orderBy: Record<string, string> = {};

    if (typeof updatedAt === "string") {
      orderBy = {
        updatedAt,
      };
    }

    let total_items = await prisma.user.count({
      where: {
        id: { contains: search as string, mode: "insensitive" },
        hidden: false,
      },
    });

    const users = await prisma.user.findMany({
      where: {
        id: { contains: search as string, mode: "insensitive" },
        hidden: false,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy,
    });

    const total_pages = Math.ceil(total_items / limit);

    return NextResponse.json({
      data: users,
      page,
      limit,
      total_items,
      total_pages,
    });
  } catch (error) {
    console.log("[GET_ALL_USERS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// CREATE USER
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "SUPERADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { username, nomorWa, password, role } = await req.json();

    if (!username || !nomorWa || !password || !role) {
      return new NextResponse(
        "Required field is missing; *username *nomorWa *password *role",
        { status: 400 }
      );
    }

    const userExist = await prisma.user.findUnique({
      where: { nomorWa: nomorWa },
    });

    if (userExist) {
      return new NextResponse("Nomor WA sudah digunakan", { status: 400 });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        nomorWa,
        password: hashPass,
        role,
      },
    });

    return NextResponse.json({ ...user, password: undefined });
  } catch (error) {
    console.log("[POST_USERS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PATCH USER / UPLOAD KTP KK
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const formData = await req.formData();
    const ktpFile = formData.get("ktpFile") as File | null;
    const kkFile = formData.get("kkFile") as File | null;

    if (!ktpFile || !kkFile) {
      return new NextResponse("No files provided", { status: 204 });
    }

    const [ktpUploadFilename, kkUploadFileName] = await Promise.all([
      uploadFileToLocal(ktpFile, "ktp", session.user.id),
      uploadFileToLocal(kkFile, "kk", session.user.id),
    ]);

    // update user kk & ktp
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ktpUrl: ktpUploadFilename,
        kkUrl: kkUploadFileName,
      },
    });

    // delete old image
    if (user.ktpUrl && user.kkUrl) {
      const ktpPath = path.join(cwd(), "uploads", "ktp", user.ktpUrl);
      const kkPath = path.join(cwd(), "uploads", "kk", user.kkUrl);

      await deleteMultipleLocalFiles([ktpPath, kkPath]);
    }

    return NextResponse.json(
      { ...updatedUser, password: undefined },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PATCH_USER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
