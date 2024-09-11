import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const filename = req.nextUrl.searchParams.get("filename") || "";
    const folder = req.nextUrl.searchParams.get("folder") || "";

    const apiUrl = `${process.env.BASE_URL}/api/files?filename=${filename}&folder=${folder}`;
    const cookies = req.headers.get("cookie") || "";

    console.log({ cookies });

    // Proxy request to your backend server
    const response = await fetch(apiUrl, {
      headers: {
        // Forward any necessary headers from the original request
        Authorization: req.headers.get("authorization") || "",
        Cookie: cookies, // Forward cookies
      },
      credentials: "include", // Ensure cookies are sent with the request
    });

    if (response.ok) {
      const contentType = response.headers.get("Content-Type") || "";
      const imageBuffer = await response.arrayBuffer();
      return new NextResponse(imageBuffer, {
        headers: {
          "Content-Type": contentType,
        },
      });
    } else {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("[PROXY_FILES]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
