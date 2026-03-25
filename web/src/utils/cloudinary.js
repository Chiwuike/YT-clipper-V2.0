/**
 * Cloudinary Upload Helper
 *
 * Uploads videos to Cloudinary and returns public URL
 * Works from both browser and Node.js server
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload video to Cloudinary (Browser or Server)
 * @param {File|Buffer|string} videoFile - File object, Buffer, or file path
 * @param {Object} options - Additional upload options
 * @returns {Promise<string>} - Cloudinary video URL
 */
export async function uploadVideoToCloudinary(videoFile, options = {}) {
  try {
    const formData = new FormData();

    // Handle different input types
    if (typeof videoFile === "string") {
      // Server-side: file path
      if (typeof window === "undefined") {
        const fs = await import("fs/promises");
        const fileBuffer = await fs.readFile(videoFile);
        const blob = new Blob([fileBuffer], { type: "video/mp4" });
        formData.append("file", blob, options.filename || "video.mp4");
      }
    } else if (videoFile instanceof File) {
      // Browser: File object
      formData.append("file", videoFile);
    } else if (Buffer.isBuffer(videoFile)) {
      // Server-side: Buffer
      const blob = new Blob([videoFile], { type: "video/mp4" });
      formData.append("file", blob, options.filename || "video.mp4");
    } else {
      throw new Error("Invalid video file format");
    }

    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    // Optional: Add folder organization
    if (options.folder) {
      formData.append("folder", options.folder);
    }

    // Optional: Add tags
    if (options.tags) {
      formData.append("tags", options.tags.join(","));
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Cloudinary upload failed: ${error.error?.message || response.statusText}`,
      );
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
      duration: data.duration,
      format: data.format,
      resourceType: data.resource_type,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

/**
 * Delete video from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<boolean>}
 */
export async function deleteVideoFromCloudinary(publicId) {
  try {
    // Note: Deletion requires authenticated requests
    // For now, videos will remain in Cloudinary
    // You can manually delete from Cloudinary dashboard
    console.log(
      `Video ${publicId} should be deleted from Cloudinary dashboard`,
    );
    return true;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
}

/**
 * Get Cloudinary video player URL
 * @param {string} publicId - Cloudinary public ID
 * @returns {string}
 */
export function getCloudinaryVideoUrl(publicId) {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}`;
}
