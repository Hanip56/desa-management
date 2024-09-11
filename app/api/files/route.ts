import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { cwd } from "process";
import fs from "fs";
import { auth } from "@/auth";
import prisma from "@/db/prisma";

export async function GET(req: NextRequest) {
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

    const filename = req.nextUrl.searchParams.get("filename") || "";
    const folder = req.nextUrl.searchParams.get("folder") || "";

    // the file can be access if it is own or admin
    const userId = filename.split(".")[0].split("--")[1];
    const isOwn = userId === session.user.id;

    if (!isOwn && session.user.role === "USER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    let filePath = path.join(cwd(), "uploads", filename);

    if (folder) {
      filePath = path.join(cwd(), "uploads", folder, filename);
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Set headers to serve image file
    const imageBuffer = fs.readFileSync(filePath);
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/jpeg", // Adjust content type based on file type (jpeg, png, etc.)
      },
    });
  } catch (error) {
    console.error("[FILES]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
