// components/VideoUpload.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // Added this
import { FaSpinner } from "react-icons/fa";

export default function VideoUpload() {
  const { t } = useTranslation(); // Initialize translation
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage ONCE
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid userInfo in localStorage");
      }
    }
  }, []);

  const token = user?.token;

  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dw76uqccg";
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "Beauty_vid";

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!video) return toast.error(t("videoUpload.errorNoFile"));

    try {
      setLoading(true);

      // ☁️ Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", video);
      formData.append("upload_preset", uploadPreset);

      const cloudRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        formData
      );

      // 📡 Send to backend
      await API.post("/api/videos", {
        videoUrl: cloudRes.data.secure_url,
        caption,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(t("videoUpload.success"));

      // reset form
      setVideo(null);
      setPreview(null);
      setCaption("");
    } catch (error) {
      console.error(error);
      toast.error(t("videoUpload.errorFail"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black p-4">
      <div className="w-full max-w-md bg-zinc-900 text-white rounded-2xl shadow-2xl p-5 border border-zinc-700">

        {/* Header */}
        <h2 className="text-xl font-bold mb-4 text-center">
          {t("videoUpload.header")}
        </h2>

        {/* Video Preview */}
        <div className="relative w-full h-60 bg-black rounded-xl overflow-hidden flex items-center justify-center border border-zinc-700">
          {preview ? (
            <video
              src={preview}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-gray-400">{t("videoUpload.noVideo")}</p>
          )}
        </div>

        {/* File Input */}
        <label className="block mt-4 cursor-pointer bg-zinc-800 hover:bg-zinc-700 transition p-3 rounded-lg text-center text-sm font-bold">
          {t("videoUpload.chooseBtn")}
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            className="hidden"
          />
        </label>

        {/* Caption */}
        <input
          className="w-full mt-3 p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-pink-500 text-sm font-medium"
          placeholder={t("videoUpload.captionPlaceholder")}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full mt-6 py-4 rounded-xl font-black transition-all transform active:scale-95 ${
            loading
              ? "bg-zinc-600 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" /> {t("videoUpload.btnUploading")}
            </div>
          ) : (
            t("videoUpload.btnUpload")
          )}
        </button>
      </div>
    </div>
  );
}