// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { FaPaperPlane, FaSpinner } from "react-icons/fa";
// import { useMessages } from "../api/swr";
// import { useAuth } from "../context/AuthContext";

// const SalonMessagesPage = () => {
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const {
//     data: conversations = [],
//     isLoading: loading,
//     error,
//   } = useMessages();

//   useEffect(() => {
//     if (conversations && conversations.length > 0) {
//       setSelectedConversation(conversations[0]);
//     }
//   }, [conversations]);

//   const getOtherParticipant = (convo) => {
//     if (!convo || !user) return { name: t("salonmessages.unknown") };
//     return convo.participants.find((p) => p._id !== user._id);
//   };

//   const getLastMessage = (convo) => {
//     if (!convo.messages || convo.messages.length === 0)
//       return t("salonmessages.noMessagesYet");
//     return convo.messages[convo.messages.length - 1].text;
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <FaSpinner className="animate-spin text-4xl text-primary-purple" />
//       </div>
//     );
//   if (error)
//     return (
//       <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md">
//         <h2 className="font-bold text-lg">{t("salonmessages.errorTitle")}</h2>
//         <p>{t("salonmessages.loadFailed")}</p>
//       </div>
//     );

//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-text-main mb-6">
//         {t("salonmessages.title")}
//       </h1>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[75vh]">
//         <div className="md:col-span-1 bg-white rounded-lg shadow-sm overflow-y-auto">
//           {conversations.length > 0 ? (
//             conversations.map((convo) => (
//               <div
//                 key={convo._id}
//                 onClick={() => setSelectedConversation(convo)}
//                 className={`p-4 border-b cursor-pointer ${
//                   selectedConversation?._id === convo._id
//                     ? "bg-purple-50"
//                     : "hover:bg-gray-50"
//                 }`}
//               >
//                 <div className="flex justify-between items-center">
//                   <p className="font-bold">
//                     {getOtherParticipant(convo)?.name}
//                   </p>
//                 </div>
//                 <p className="text-sm text-text-muted truncate">
//                   {getLastMessage(convo)}
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {new Date(convo.updatedAt).toLocaleDateString()}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p className="p-4 text-center text-text-muted">
//               {t("salonmessages.noConversations")}
//             </p>
//           )}
//         </div>

//         <div className="md:col-span-3 bg-white rounded-lg shadow-sm flex flex-col">
//           {selectedConversation ? (
//             <>
//               <div className="p-4 border-b font-bold text-lg">
//                 {getOtherParticipant(selectedConversation)?.name}
//               </div>
//               <div className="flex-1 p-6 space-y-4 overflow-y-auto">
//                 {selectedConversation.messages.map((msg) => (
//                   <div
//                     key={msg._id}
//                     className={`flex ${
//                       msg.sender === user._id ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
//                         msg.sender === user._id
//                           ? "bg-primary-purple text-white"
//                           : "bg-gray-200"
//                       }`}
//                     >
//                       {msg.text}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="p-4 border-t bg-gray-50">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder={t("salonmessages.typeMessage")}
//                     className="w-full p-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-purple"
//                   />
//                   <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-purple hover:text-primary-pink">
//                     <FaPaperPlane size={20} />
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex items-center justify-center h-full text-text-muted">
//               <p>{t("salonmessages.selectConversation")}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalonMessagesPage;



import React, { useEffect, useState, useMemo } from "react"; // Added useMemo
import { useTranslation } from "react-i18next";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { useMyConversations } from "../api/swr";     
import { useAuth } from "../context/AuthContext";

const SalonMessagesPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);

  const {
    data: conversationsData,
    isLoading: loading,
    error,
  } = useMyConversations();

  // FIX: Wrap in useMemo to stabilize dependencies for useEffect
  const conversations = useMemo(() => conversationsData?.conversations || [], [conversationsData]);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  const getOtherParticipant = (convo) => {
    if (!convo?.participants?.length || !user) {
      return convo?.isGuestConversation 
        ? convo.guestInfo 
        : { name: "Unknown User" };
    }
    return convo.participants.find((p) => p._id !== user._id) || { name: "Customer" };
  };

  const getLastMessage = (convo) => {
    if (!convo?.messages?.length) return "No messages yet";
    const lastMsg = convo.messages[convo.messages.length - 1];
    return lastMsg.text;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-purple" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-lg">Failed to load messages</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-6">
        {t("salonmessages.title") || "Messages"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[75vh]">
        {/* Conversations List */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border border-gray-100">
          <div className="p-4 border-b font-black text-xs uppercase tracking-widest text-gray-400">All Conversations</div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((convo) => {
                const other = getOtherParticipant(convo);
                return (
                  <div
                    key={convo._id}
                    onClick={() => setSelectedConversation(convo)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                      selectedConversation?._id === convo._id ? "bg-purple-50 border-r-4 border-purple-600" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-gray-800">
                        {other?.name || "Guest"}
                        {convo.isGuestConversation && (
                          <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">GUEST</span>
                        )}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {getLastMessage(convo)}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">
                      {new Date(convo.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-400 font-medium italic">
                No conversations yet
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-3 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden border border-gray-100">
          {selectedConversation ? (
            <>
              <div className="p-5 border-b flex items-center gap-3 bg-white">
                <div className="font-black text-xl text-gray-900 tracking-tight">
                  {getOtherParticipant(selectedConversation)?.name}
                </div>
                {selectedConversation.isGuestConversation && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-black uppercase">
                    Guest User
                  </span>
                )}
              </div>

              <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#F5F5F7]">
                {selectedConversation.messages.map((msg, index) => {
                   const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                   return (
                    <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] px-4 py-3 rounded-2xl font-medium text-sm shadow-sm ${
                            isMe ? "bg-primary-purple text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                        }`}>
                        {msg.text}
                        </div>
                    </div>
                   );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <form className="relative" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full p-4 pr-14 rounded-2xl border-none bg-gray-50 focus:ring-2 focus:ring-primary-purple outline-none font-medium"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-purple hover:text-purple-700 p-2">
                    <FaPaperPlane size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 font-bold italic">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalonMessagesPage;