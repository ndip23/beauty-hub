import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft, FaImages, FaMapMarkerAlt, FaStar, FaSpinner, FaPhone
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "yet-another-react-lightbox/styles.css";
import { createAppointment, addReview, getSalonBySlug } from "../api"; 
import { useAuth } from "../context/AuthContext";
import BookingModal from "../components/BookingModal";
import Button from "../components/Button";

const SalonDetailPage = () => {
  const { t } = useTranslation();
  const { id: slug } = useParams();
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const [salon, setSalon] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  const [setLightboxOpen] = useState(false);
  const [setPhotoIndex] = useState(0);
  const [setActiveImages] = useState([]);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "", guestName: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchSalonData = useCallback(async () => {
    try {
      setFetching(true);
      const { data } = await getSalonBySlug(slug);
      setSalon(data.data);
    } catch (err) {
      console.error("Load Error:", err);
      toast.error("Could not load salon details");
    } finally {
      setFetching(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchSalonData();
  }, [fetchSalonData]);

  const openGallery = (images, index = 0) => {
    if (!images || images.length === 0) return;
    setActiveImages(images);
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleBookClick = (service) => {
    setSelectedService(service); 
    setIsModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!salon?._id) return;
    setSubmittingReview(true);
    try {
      const reviewPayload = user ? { ...reviewForm, user: user._id } : reviewForm;
      await addReview(salon._id, reviewPayload);
      toast.success("Review posted!");
      setReviewForm({ rating: 5, comment: "", guestName: "" });
      fetchSalonData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleConfirmBooking = async (bookingData) => {
    try {
      await createAppointment({
        salonId: salon._id,
        serviceId: bookingData.serviceId,
        appointmentDateTime: bookingData.preferredDateTime,
        clientName: bookingData.customerName,
        clientNumber: bookingData.customerPhone,
        homeService: bookingData.location === "home",
      });
      toast.success(t("salondetail.bookingSuccess"));
      setIsModalOpen(false);
      const phoneClean = salon?.phone?.replace(/[^0-9]/g, "");
      const whatsappUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(bookingData?.chatMessage)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      
      // Refresh after booking to update wallet state on UI
      fetchSalonData();
    } catch (err) {
      toast.error(err.response?.data?.message || t("salondetail.bookingFailed"));
    }
  };

  if (fetching) return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-primary-purple text-5xl" /></div>;
  if (!salon) return <div className="text-center py-20 text-red-600 font-bold">{t("salondetail.loadFailedGoBack")}</div>;

  // 🚀 WALLET SYSTEM CHECK: 
  // Salon owner must have >= $0.50 to accept bookings
  const canBook = salon.owner && (salon.owner.walletBalance >= 0.50 || salon.owner.isVerified);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-20 font-sans">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-800 font-bold hover:text-primary-purple transition">
            <FaArrowLeft size={16} /> <span>{salon.name}</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-24 py-8">
        <div className="flex flex-col md:flex-row gap-8 mb-12 items-start">
           <div className="w-full md:w-1/3">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4 leading-tight">{salon.name}</h1>
              <div className="flex items-center gap-2 mb-6">
                 <div className="bg-yellow-400/20 text-yellow-700 px-3 py-1 rounded-full flex items-center gap-1 font-bold text-sm">
                    <FaStar size={12} /> {salon.averageRating?.toFixed(1) || "New"}
                 </div>
                 <span className="text-gray-400 font-medium text-sm">({salon.reviews?.length || 0} Reviews)</span>
              </div>
              <div className="space-y-3 text-gray-600 font-medium">
                  <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-primary-purple" /> {salon.city}, {salon.address}</p>
                  <p className="flex items-center gap-2"><FaPhone className="text-primary-purple" /> {salon.phone}</p>
              </div>
           </div>
           
           <div className="w-full md:w-2/3 h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white cursor-pointer group relative" onClick={() => openGallery(salon.photos, 0)}>
              <img src={salon.photos?.[0] || "https://via.placeholder.com/800"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={salon.name} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-full">View All Photos</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <h2 className="text-3xl font-black mb-8 tracking-tight">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {salon.services?.map((service) => (
                  <div key={service._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
                    <div className="h-44 overflow-hidden relative cursor-pointer" onClick={() => openGallery(service.photos.length > 0 ? service.photos : salon.photos)}>
                        <img 
                            src={service.photos && service.photos.length > 0 ? service.photos[0] : salon.photos?.[0]} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            alt={service.name} 
                        />
                        {service.photos?.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md font-bold">
                                +{service.photos.length - 1} More
                            </div>
                        )}
                    </div>
                    <div className="p-5 flex flex-col flex-grow bg-white relative z-10 -mt-4 rounded-t-3xl">
                        <h3 className="font-bold text-xl text-gray-900 line-clamp-1">{service.name}</h3>
                        <p className="text-gray-400 text-sm font-medium mb-4 line-clamp-1">{service.description || "Expert service"}</p>
                        <div className="mt-auto flex justify-between items-center">
                            <span className="font-black text-primary-purple text-xl">
                                {salon.currency} {service.price}
                            </span>
                            
                            {/* 🚀 DYNAMIC BUTTON BASED ON BALANCE */}
                            <Button 
                              variant={canBook ? "gradient" : "disabled"} 
                              disabled={!canBook}
                              onClick={canBook ? () => handleBookClick(service) : null}
                              className="!py-2 !px-6 rounded-2xl text-sm font-bold shadow-md transform active:scale-95" 
                            >
                                {canBook ? t("salondetail.book") : "Unavailable"}
                            </Button>
                        </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Reviews Section ... */}
             <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black mb-8 tracking-tight">Client Reviews</h2>
              <div className="space-y-6 mb-12">
                {salon.reviews?.length > 0 ? salon.reviews.map((rev, i) => (
                  <div key={i} className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex gap-1 text-orange-400 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <FaStar key={j} size={14} className={j < rev.rating ? "fill-current" : "text-gray-200"} />
                      ))}
                    </div>
                    <p className="text-gray-700 text-lg italic leading-relaxed">"{rev.comment}"</p>
                    <p className="mt-4 font-black text-gray-900 text-sm uppercase tracking-wider">— {rev.user?.name || rev.guestName || "Verified Client"}</p>
                  </div>
                )) : <p className="text-gray-400 text-center py-10 font-medium">No reviews yet. Be the first!</p>}
              </div>

              <div className="bg-primary-purple/5 p-8 rounded-3xl border border-primary-purple/10">
                <h3 className="font-black text-xl mb-6">Leave a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  {!user && (
                    <input 
                      type="text" placeholder="Your Name" value={reviewForm.guestName}
                      onChange={(e) => setReviewForm({...reviewForm, guestName: e.target.value})}
                      className="w-full p-4 bg-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-purple font-bold shadow-sm" required
                    />
                  )}
                  <div className="flex gap-2 text-3xl">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewForm({...reviewForm, rating: s})}>
                        {s <= reviewForm.rating ? <FaStar className="text-yellow-400" /> : <FaStar className="text-gray-200" />}
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={reviewForm.comment} onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    placeholder="Tell us about your experience..."
                    className="w-full p-6 bg-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-purple shadow-sm" rows="3" required
                  />
                  <Button type="submit" disabled={submittingReview} className="rounded-full px-12 !py-4 text-lg">
                    {submittingReview ? <FaSpinner className="animate-spin" /> : "Post Review"}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 sticky top-28">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <FaImages className="text-primary-purple" /> <span>{t("salondetail.gallery")}</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {salon.photos?.map((photo, idx) => (
                  <img 
                    key={idx} src={photo} 
                    className="w-full h-28 object-cover rounded-2xl cursor-pointer hover:scale-105 transition-transform" 
                    onClick={() => openGallery(salon.photos, idx)} alt="Gallery" 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        salonId={salon?._id}
        salonName={salon?.name}
        onBookingConfirmed={handleConfirmBooking}
        onImageClick={(images, index) => openGallery(images, index)}
      />
    </div>
  );
};

export default SalonDetailPage;