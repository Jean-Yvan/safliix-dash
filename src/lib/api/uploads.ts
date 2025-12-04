import { ApiError } from "./client";

export async function uploadToPresignedUrl(url: string, file: Blob): Promise<void> {
  const response = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });

  if (!response.ok) {
    throw new ApiError("Upload to storage failed", response.status);
  }
}
