import { getCloudinaryUploadSignature, uploadImage } from "@/lib/actions";

/**
 * Uploads media directly to Cloudinary using signed direct upload from the browser.
 * Bypasses Vercel 4.5MB request body limits and avoids serverless function timeouts.
 * Falls back to uploadImage server action if direct upload is blocked.
 */
export async function uploadMediaToCloudinary(
  fileOrBlob: File | Blob,
  fallbackBase64?: string
): Promise<string | null> {
  try {
    const sig = await getCloudinaryUploadSignature();
    if (sig?.success && sig.signature && sig.apiKey && sig.cloudName) {
      const fd = new FormData();
      fd.append("file", fileOrBlob);
      fd.append("api_key", sig.apiKey);
      fd.append("timestamp", String(sig.timestamp));
      fd.append("folder", sig.folder || "giftisan");
      fd.append("signature", sig.signature);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
        {
          method: "POST",
          body: fd,
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data?.secure_url) {
          return data.secure_url;
        }
      }
    }
  } catch (directErr) {
    console.warn("Direct Cloudinary upload failed, attempting fallback:", directErr);
  }

  // Fallback: use server action uploadImage if base64 data is provided
  if (fallbackBase64 && fallbackBase64.startsWith("data:")) {
    try {
      const res = await uploadImage(fallbackBase64);
      if (res?.success && res.url) {
        return res.url;
      }
    } catch (fallbackErr) {
      console.error("Server action uploadImage failed:", fallbackErr);
    }
  }

  return null;
}
