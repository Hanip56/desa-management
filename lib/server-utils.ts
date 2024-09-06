import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadFileToCloudinary = async (file: File, folder: string) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<UploadApiResponse | undefined>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          type: "authenticated",
          transformation: { quality: "auto:good" },
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });
};

export const deleteMultipleFilesCloudinary = async (publicIds: string[]) => {
  try {
    const deletePromises = publicIds.map((publicId) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(
          publicId,
          { type: "authenticated" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });
    });

    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    throw new Error("Error deleting files: " + (error as any)?.message);
  }
};

export const getSignedUrl = (publicId: string) => {
  return cloudinary.url(publicId, {
    type: "authenticated",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  });
};
