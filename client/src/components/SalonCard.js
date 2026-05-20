// import React from "react";
// import { FaCheckCircle, FaStar, FaMapMarkerAlt } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import Button from "./Button";

// const SalonCard = ({ salon }) => {
//   if (!salon) return null;

//   const rating = salon.averageRating || 0;
//   const displayPrice = salon.minPrice || 2500;
//   const displayImage = salon.photos?.[0] || `https://placehold.co/400x300/a855f7/ffffff?text=${encodeURIComponent(salon.name.slice(0, 2).toUpperCase())}`;

//   return (
//     <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full group">
//       <div className="relative overflow-hidden">
//         <img className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110" src={displayImage} alt={salon.name} loading="lazy" />
//         {salon.isVerified && (
//           <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-lg z-10">
//             <FaCheckCircle size={10}/> Verified
//           </div>
//         )}
//       </div>

//       <div className="p-6 flex flex-col flex-grow">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="text-xl font-black text-gray-900 leading-tight line-clamp-1">{salon.name}</h3>
//           <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg shrink-0">
//             <FaStar className="text-yellow-500" size={14} />
//             <span className="font-bold text-sm text-yellow-700">{rating > 0 ? rating.toFixed(1) : "New"}</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
//             <FaMapMarkerAlt /> <span>{salon.city}, {salon.address}</span>
//         </div>

//         <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-end">
//           <div>
//             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting at</p>
//             <p className="text-2xl font-black text-primary-purple">
//                 {salon.currency || 'XAF'} {displayPrice.toLocaleString()}
//             </p>
//           </div>
//           <Link to={`/salon/${salon.slug}`}>
//             <Button variant="gradient" className="!py-2 !px-6 rounded-full font-bold shadow-lg transform active:scale-95 transition-all">
//               Book
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalonCard;




import React, { useState } from "react";
import { FaCheckCircle, FaStar, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "./Button";
import InquiryModal from "./InquiryModal";   

const SalonCard = ({ salon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!salon) return null;

  const rating = salon.averageRating || 0;
  const displayPrice = salon.minPrice || 2500;
  const displayImage = salon.photos?.[0] || `https://placehold.co/400x300/a855f7/ffffff?text=${encodeURIComponent(salon.name.slice(0, 2).toUpperCase())}`;

  // 🚀 WALLET PROTECTION CHECK (Per Booking System)
  // Owner must have >= $0.50, or be verified by Admin to show active action buttons
  const MIN_REQUIRED_FEE = 0.50;
  const canBook = salon.owner && (salon.owner.walletBalance >= MIN_REQUIRED_FEE || salon.owner.isVerified);

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full group">
      <div className="relative overflow-hidden">
        <img 
          className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110" 
          src={displayImage} 
          alt={salon.name} 
          loading="lazy" 
        />
        {salon.isVerified && (
          <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-lg z-10">
            <FaCheckCircle size={10}/> Verified
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black text-gray-900 leading-tight line-clamp-1">{salon.name}</h3>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg shrink-0">
            <FaStar className="text-yellow-500" size={14} />
            <span className="font-bold text-sm text-yellow-700">{rating > 0 ? rating.toFixed(1) : "New"}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
          <FaMapMarkerAlt /> <span>{salon.city}, {salon.address}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-end gap-3">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting at</p>
            <p className="text-2xl font-black text-primary-purple">
              {salon.currency || 'XAF'} {displayPrice.toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">
            {/* 🚀 DYNAMIC BOOK BUTTON */}
            {canBook ? (
              <Link to={`/salon/${salon.slug}`}>
                <Button variant="gradient" className="!py-2 !px-6 rounded-full font-bold shadow-lg">
                  Book
                </Button>
              </Link>
            ) : (
              <Button variant="disabled" disabled={true} className="!py-2 !px-6 rounded-full font-bold">
                Unavailable
              </Button>
            )}

            {/* 🚀 DYNAMIC MESSAGE BUTTON */}
            <Button 
              onClick={canBook ? () => setIsModalOpen(true) : null}
              variant={canBook ? "outline" : "disabled"}
              disabled={!canBook}
              className={`!py-2 !px-5 rounded-full font-medium flex items-center gap-2 ${
                canBook ? "hover:bg-gray-50" : ""
              }`}
            >
              <FaEnvelope /> {canBook ? "Message" : "Locked"}
            </Button>
          </div>
        </div>
      </div>

      {/* Guest Inquiry Modal */}
      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        salonId={salon._id}
        salonName={salon.name}
      />
    </div>
  );
};

export default SalonCard;