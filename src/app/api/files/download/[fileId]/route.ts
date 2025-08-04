import { LocalStorageStrategy } from "@/lib/storage/local-storage";
import { storageManager } from "@/lib/storage/storage-manager";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params;

  if (!fileId) {
    return NextResponse.json({ error: "File ID is required" }, { status: 400 });
  }

  try {
    const storage = storageManager.getStrategy();

    // We need to get metadata to get the original file name
    // This assumes the strategy has a method to get metadata.
    // For LocalStorageStrategy, we can add a public getMetadata method.
    if (storage instanceof LocalStorageStrategy) {
      const metadata = await storage.getMetadata(fileId);
      if (!metadata) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      const fileBuffer = await storage.download(fileId);
      const uint8Array = new Uint8Array(fileBuffer);

      const headers = new Headers();
      headers.set("Content-Type", metadata.type);
      headers.set(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(metadata.name)}"`,
      );

      return new NextResponse(uint8Array, {
        status: 200,
        headers,
      });
    } else {
      // For other storages, you might need a different way to get the original name
      const fileBuffer = await storage.download(fileId);
      const uint8Array = new Uint8Array(fileBuffer);
      // This is a fallback and might not have the correct filename
      return new NextResponse(uint8Array, {
        status: 200,
      });
    }
  } catch (error) {
    console.error("Download error:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 },
    );
  }
}
