import { auth } from "@/auth";
import { getDiprosesCountAndLatest } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

// GET PENGAJUAN DIPROSES INFORMATION (COUNT & LATEST)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role === "USER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { totalDiproses, latestRecords } = await getDiprosesCountAndLatest();

    const latestRecordWithLink = latestRecords?.map((record, i) => ({
      ...record,
      link: `/pengajuan/${record.jenis.toLowerCase().replace(/\s/g, "-")}/${
        record.id
      }`,
    }));

    return NextResponse.json({
      totalDiproses,
      latestRecords: latestRecordWithLink,
    });
  } catch (error) {
    console.log("[GET_PENGAJUAN_DIPROSES]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
