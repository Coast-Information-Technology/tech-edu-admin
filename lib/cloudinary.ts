const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL as string;
const CLOUDINARY_UPLOAD_PRESET = process.env
  .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!CLOUDINARY_URL || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary config missing");
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.secure_url) throw new Error("Cloudinary upload failed");
  return data.secure_url;
}

export async function uploadFileToCloudinary(file: File): Promise<{
  url: string;
  publicId: string;
  format: string;
  size: number;
}> {
  if (!CLOUDINARY_URL || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary config missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  // Add resource type for better file handling
  if (file.type.startsWith("image/")) {
    formData.append("resource_type", "image");
  } else if (file.type.includes("pdf") || file.type.includes("document")) {
    formData.append("resource_type", "raw");
  } else {
    formData.append("resource_type", "auto");
  }

  const res = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!data.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    format: data.format || file.type.split("/")[1],
    size: data.bytes || file.size,
  };
}
