import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const fileUrl = process.env.MOBILE_APP_LINK_DOWNLOAD!; // External file URL

    // Fetch the file from the external source
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to download the file" },
        { status: 500 }
      );
    }

    const fileStream = await response.body;

    // Stream the file back to the client with appropriate headers
    return new NextResponse(fileStream, {
      headers: {
        "Content-Disposition": 'attachment; filename="margaasih.apk"', // Force the download as a file
        "Content-Type": "application/vnd.android.package-archive", // APK MIME type
      },
    });
  } catch (error) {
    console.error("[APK]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
