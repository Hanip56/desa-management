import { createReadStream, statSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    // Construct the absolute file path to the APK file
    const filePath = path.join(process.cwd(), "public", "margaasih.apk");

    // Get the file size (optional but recommended for the response header)
    const fileStat = statSync(filePath);

    // Create a Node.js read stream for the APK file
    const nodeStream = createReadStream(filePath);

    // Convert the Node.js stream to a Web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => controller.enqueue(chunk));
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", (err) => controller.error(err));
      },
    });

    // Return the file as a streamed response
    return new Response(readableStream, {
      headers: {
        "Content-Disposition": 'attachment; filename="margaasih.apk"', // Force download
        "Content-Type": "application/vnd.android.package-archive", // APK MIME type
        "Content-Length": fileStat.size.toString(), // File size
      },
    });
  } catch (error) {
    console.error("[APK]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
