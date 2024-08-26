import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { resizeImageBuffer } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { namaKepalaDesa } = await req.json();

//     const setting = await prisma.setting.create({
//       data: {
//         namaKepalaDesa,
//       },
//     });

//     return NextResponse.json(setting);
//   } catch (error) {
//     console.log("[CREATE_SETTING]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    if (session.user.role === "USER")
      return new NextResponse("Forbidden", { status: 403 });

    const setting = await prisma.setting.findFirst();

    if (!setting) {
      return new NextResponse("Setting not found", { status: 404 });
    }

    const formData = await req.formData();
    const namaKepalaDesa = formData.get("namaKepalaDesa") as string | null;
    const namaBabinsa = formData.get("namaBabinsa") as string | null;
    const pangkatBabinsa = formData.get("pangkatBabinsa") as string | null;
    const nrpBabinsa = formData.get("nrpBabinsa") as string | null;
    const jabatanBabinsa = formData.get("jabatanBabinsa") as string | null;
    const namaBhabinkamtibmas = formData.get("namaBhabinkamtibmas") as
      | string
      | null;
    const pangkatBhabinkamtibmas = formData.get("pangkatBhabinkamtibmas") as
      | string
      | null;
    const nrpBhabinkamtibmas = formData.get("nrpBhabinkamtibmas") as
      | string
      | null;
    const jabatanBhabinkamtibmas = formData.get("jabatanBhabinkamtibmas") as
      | string
      | null;
    const tte = formData.get("tte") as File;
    let tteBuffer: Buffer | undefined = undefined;

    if (tte) {
      const arrayBuffer = await tte.arrayBuffer();
      tteBuffer = Buffer.from(arrayBuffer);

      tteBuffer = await resizeImageBuffer(tteBuffer, 100, 100); // change size to smaller
    }

    const updatedSetting = await prisma.setting.update({
      where: {
        id: setting.id,
      },
      data: {
        namaKepalaDesa: namaKepalaDesa ?? undefined,
        namaBabinsa: namaBabinsa ?? undefined,
        pangkatBabinsa: pangkatBabinsa ?? undefined,
        nrpBabinsa: nrpBabinsa ?? undefined,
        jabatanBabinsa: jabatanBabinsa ?? undefined,
        namaBhabinkamtibmas: namaBhabinkamtibmas ?? undefined,
        pangkatBhabinkamtibmas: pangkatBhabinkamtibmas ?? undefined,
        nrpBhabinkamtibmas: nrpBhabinkamtibmas ?? undefined,
        jabatanBhabinkamtibmas: jabatanBhabinkamtibmas ?? undefined,
        tte: tteBuffer,
      },
    });

    return NextResponse.json(updatedSetting);
  } catch (error) {
    console.log("[UPDATE_SETTING]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
