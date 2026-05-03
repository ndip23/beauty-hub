

// // components/VideoCard.jsx
// import { useState } from "react";
// import { FaHeart, FaComment, FaShare } from "react-icons/fa";
// import { AiOutlineClose } from "react-icons/ai";
// import { getFingerprint } from "../../utils/FingerPrints";
// import { API } from "../../api";
// import { toast } from "react-toastify";

// export default function VideoCard({ video }) {
//   const [comment, setComment] = useState("");
//   const [name, setName] = useState("");
//   const [openComment, setOpenComment] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // ❤️ Like
//   const like = async () => {
//     try {
//       const fingerprint = await getFingerprint();

//       await API.post("/api/videos/like", {
//         videoId: video._id,
//         fingerprint,
//       });

//       toast.success("Liked ❤️");
//     } catch (err) {
//       toast.error("Already liked");
//     }
//   };

//   // 💬 Comment
//   const sendComment = async () => {
//     if (!name || !comment) return toast.error("Fill all fields");

//     try {
//       setLoading(true);

//       const fingerprint = await getFingerprint();

//       await API.post("/api/videos/comment", {
//         videoId: video._id,
//         text: comment,
//         name,
//         fingerprint,
//       });

//       toast.success("Comment added 💬");
//       setComment("");
//       setName("");
//       setOpenComment(false);
//     } catch (err) {
//       toast.error("Failed to comment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔁 Share
//   const share = async () => {
//     try {
//       await API.post("/api/videos/share", {
//         videoId: video._id,
//       });

//       toast.success("Shared 🔁");
//     } catch {
//       toast.error("Share failed");
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center bg-gray-100 relative">

//       {/* VIDEO */}
//       <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl bg-black">
//         <video
//           src={video.videoUrl}
//           className="w-full h-[70vh] object-cover"
//           autoPlay
//           loop
//           muted
//           controls
//         />
//       </div>

//       {/* INFO */}
//       <div className="w-full max-w-md mt-3 px-4">
//         <p className="text-gray-800 font-semibold">{video.caption}</p>

//         {/* ACTIONS */}
//         <div className="flex items-center justify-between mt-3 text-gray-700">

//           <button onClick={like} className="flex items-center gap-1 hover:text-red-500">
//             <FaHeart />
//             <span>{video.likesCount}</span>
//           </button>

//           <button
//             onClick={() => setOpenComment(true)}
//             className="flex items-center gap-1 hover:text-blue-500"
//           >
//             <FaComment />
//             <span>{video.commentsCount}</span>
//           </button>

//           <button onClick={share} className="flex items-center gap-1 hover:text-green-500">
//             <FaShare />
//             <span>{video.sharesCount}</span>
//           </button>
//         </div>
//       </div>

//       {/* 💬 COMMENT MODAL */}
//       {openComment && (
//         <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">

//           <div className="bg-white w-full max-w-md rounded-t-2xl p-4 animate-slideUp">

//             {/* HEADER */}
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="font-bold text-lg">Comments</h2>
//               <button onClick={() => setOpenComment(false)}>
//                 <AiOutlineClose size={22} />
//               </button>
//             </div>

//             {/* NAME */}
//             <input
//               className="w-full border p-2 rounded mb-2"
//               placeholder="Your name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />

//             {/* COMMENT */}
//             <textarea
//               className="w-full border p-2 rounded"
//               placeholder="Write a comment..."
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//             />

//             {/* SEND */}
//             <button
//               onClick={sendComment}
//               disabled={loading}
//               className="w-full mt-3 bg-black text-white py-2 rounded"
//             >
//               {loading ? "Sending..." : "Send"}
//             </button>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





// components/VideoCard.jsx
import { useState } from "react";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { getFingerprint } from "../../utils/FingerPrints";
import { API } from "../../api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // Added this

export default function VideoCard({ video }) {
  const { t } = useTranslation(); // Initialize translation
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [openComment, setOpenComment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const videoUrl = `${window.location.origin}/video/${video._id}`;

  // ❤️ Like
  const like = async () => {
    try {
      const fingerprint = await getFingerprint();
      await API.post("/api/videos/like", {
        videoId: video._id,
        fingerprint,
      });
      toast.success(t("videoCard.liked"));
    } catch {
      toast.error(t("videoCard.alreadyLiked"));
    }
  };

  // 💬 Load comments
  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/api/videos/${video._id}/comments`);
      setComments(data);
    } catch {
      toast.error(t("videoCard.loadCommentsErr"));
    }
  };

  const openCommentBox = () => {
    setOpenComment(true);
    fetchComments();
  };

  // 💬 Send comment
  const sendComment = async () => {
    if (!name || !comment) return toast.error(t("videoCard.fillFields"));

    try {
      setLoading(true);
      const fingerprint = await getFingerprint();

      const { data } = await API.post("/api/videos/comment", {
        videoId: video._id,
        text: comment,
        name,
        fingerprint,
      });

      setComments((prev) => [data, ...prev]);
      setComment("");
      toast.success(t("videoCard.commentAdded"));
    } catch {
      toast.error(t("videoCard.commentFail"));
    } finally {
      setLoading(false);
    }
  };

  // 🔁 SHARE
  const share = async () => {
    try {
      await API.post("/api/videos/share", { videoId: video._id });

      if (navigator.share) {
        await navigator.share({
          title: t("videoCard.shareTitle"),
          text: video.caption,
          url: videoUrl,
        });
      } else {
        await navigator.clipboard.writeText(videoUrl);
        toast.success(t("videoCard.copySuccess"));
      }
      toast.success(t("videoCard.shared"));
    } catch {
      toast.error(t("videoCard.shareFail"));
    }
  };

  return (
    <div className="w-full flex justify-center bg-gray-50 py-6">
      {/* CONTAINER */}
      <div className="w-full md:w-[500px] lg:w-[600px] bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        {/* VIDEO */}
        <video
          src={video.videoUrl}
          className="w-full h-[70vh] object-cover bg-black shadow-inner"
          autoPlay
          loop
          muted
          controls
        />

        {/* INFO */}
        <div className="p-6">
          <p className="text-gray-900 font-black text-lg tracking-tight mb-4">{video.caption}</p>

          {/* ACTIONS */}
          <div className="flex justify-between items-center text-gray-700 font-bold">
            <button onClick={like} className="flex items-center gap-2 hover:text-red-500 transition-colors">
              <FaHeart size={20} />
              <span>{video.likesCount}</span>
            </button>

            <button onClick={openCommentBox} className="flex items-center gap-2 hover:text-primary-purple transition-colors">
              <FaComment size={20} />
              <span>{video.commentsCount}</span>
            </button>

            <button onClick={share} className="flex items-center gap-2 hover:text-emerald-500 transition-colors">
              <FaShare size={20} />
              <span>{video.sharesCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 💬 COMMENT MODAL */}
      {openComment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-[100] p-4">
          <div className="bg-white w-full md:w-[500px] max-h-[85vh] rounded-[2.5rem] shadow-2xl p-8 overflow-hidden flex flex-col relative animate-in slide-in-from-bottom duration-300">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-2xl tracking-tight text-gray-900">{t("videoCard.commentsHeader")}</h2>
              <button onClick={() => setOpenComment(false)} className="p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                <AiOutlineClose size={20} />
              </button>
            </div>

            {/* COMMENT LIST */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 scrollbar-hide pr-2">
              {comments.length === 0 ? (
                <div className="text-center py-10 opacity-50 italic">{t("videoCard.noComments")}</div>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="font-black text-primary-purple text-xs uppercase tracking-widest mb-1">{c.name}</p>
                    <p className="text-gray-700 text-sm font-medium leading-relaxed">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* INPUTS */}
            <div className="space-y-3">
              <input
                className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-purple font-bold text-sm"
                placeholder={t("videoCard.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary-purple font-medium text-sm resize-none"
                rows="2"
                placeholder={t("videoCard.commentPlaceholder")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={sendComment}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary-pink to-primary-purple text-white rounded-full font-black text-lg shadow-lg shadow-purple-100 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {loading ? t("videoCard.btnSending") : t("videoCard.btnSend")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}