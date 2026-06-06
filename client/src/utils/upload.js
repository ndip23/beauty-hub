// src/utils/upload.js
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Beautyhub_preset"); 

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dw76uqccg/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    
    const data = await response.json();

    // --- DEBUG LOG: This will tell us the exact error ---
    if (data.error) {
        console.error("CLOUDINARY ERROR:", data.error.message);
        return null;
    }

    return data.secure_url; 
  } catch (error) {
    console.error("NETWORK ERROR:", error);
    return null;
  }
};