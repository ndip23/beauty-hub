/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react"; 
import { Trash2, Play, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // Added this
import { API } from "../../api";

const MyVideos = () => {
  const { t } = useTranslation(); // Initialize translation
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
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

  // fetchMyVideos
  const fetchMyVideos = useCallback(async () => {
    if (!token) return; 

    try {
      setLoading(true);
      const res = await API.get("/api/videos/my-videos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(res.data.videos || []);
    } catch (err) {
      toast.error(t("myVideos.loadError"));
    } finally {
      setLoading(false);
    }
  }, [token, t]);

  useEffect(() => {
    fetchMyVideos();
  }, [fetchMyVideos]);

  // Delete video
  const handleDelete = async (videoId) => {
    if (!window.confirm(t("myVideos.deleteConfirm"))) return;

    try {
      setDeletingId(videoId);
      await API.delete(`/api/videos/my-videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVideos((prev) => prev.filter((v) => v._id !== videoId));
      toast.success(t("myVideos.deleteSuccess"));
    } catch (err) {
      toast.error(t("myVideos.deleteError"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] px-4 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 text-center">
              {t("myVideos.title")}
            </h1>
            <div className="h-1 w-20 bg-primary-purple mx-auto mt-4 rounded-full" />
        </header>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <Loader2 className="animate-spin h-12 w-12 text-primary-purple" />
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest italic">Syncing Gallery...</p>
          </div>
        ) : videos.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-gray-100">
            <div className="text-7xl mb-6">🎥</div>
            <p className="text-2xl font-black text-gray-900 tracking-tight">
              {t("myVideos.emptyState")}
            </p>
          </div>
        ) : (
          /* Videos Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {videos.map((video) => (
              <motion.div
                key={video._id}
                whileHover={{ y: -8 }}
                className="relative group bg-gray-900 rounded-[2rem] overflow-hidden shadow-xl border border-white"
              >
                {/* Video */}
                <video
                  src={video.videoUrl}
                  className="w-full h-80 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-5">
                  {/* Delete Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="bg-red-500/90 hover:bg-red-600 text-white p-3 rounded-2xl shadow-lg backdrop-blur-md transition-all active:scale-90"
                      disabled={deletingId === video._id}
                    >
                      {deletingId === video._id ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>

                  {/* Video Info Bottom */}
                  <div className="animate-in slide-in-from-bottom-2 duration-500">
                    <p className="text-white text-sm font-bold line-clamp-2 mb-3">
                      {video.caption || t("myVideos.noCaption")}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                        <span className="text-xs font-black text-pink-400">❤️ {video.likesCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                        <span className="text-xs font-black text-purple-300">💬 {video.commentsCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Initial Play Icon Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:hidden transition-all">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
                    <Play className="text-white fill-white ml-1" size={30} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVideos;