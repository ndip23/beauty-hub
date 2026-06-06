"use client";

import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  FaCalendarPlus, FaRegComments, FaRegStar, FaSpinner, FaPlus, 
  FaWallet, FaStore, FaConciergeBell, FaCalendarAlt, FaArrowRight, FaCopy, FaCheck, FaTimes,
  FaProductHunt, FaCreditCard, FaReceipt, FaCommentDots, FaStar, FaChartLine, FaVideo, FaPlayCircle, FaCog
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useMySalon, useSalonAppointments } from "../api/swr";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const SalonDashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: salonData, isLoading: loadingSalon, error: salonError } = useMySalon();
  const { data: appointments = [], isLoading: loadingAppointments } = useSalonAppointments(salonData?._id);

  const [copied, setCopied] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const loading = loadingSalon || loadingAppointments;

  const tourSteps = [
    {
      title: "Welcome to your salon dashboard",
      description: "This is your control center. Use the quick links below to update your profile, add services, check bookings and manage payments.",
    },
    {
      title: "Wallet & Top-up",
      description: "Keep your wallet funded to stay live. Tap here to instantly add funds and continue receiving bookings.",
    },
    {
      title: "Edit Profile",
      description: "Use this card to update your salon details, contact info, and photos so customers can find you easily.",
    },
    {
      title: "Appointments",
      description: "Check upcoming bookings and client requests from one place. This card takes you to the appointment calendar.",
    },
  ];

  useEffect(() => {
    const tourSeen = localStorage.getItem("salonDashboardTourSeen");
    const hasWallet = user && (Number(user.walletBalance) >= 0.5 || user.isVerified);
    const hasServices = salonData && salonData.services && salonData.services.length > 0;

    if (!tourSeen && salonData && hasWallet && hasServices) {
      setShowTour(true);
    }
  }, [salonData, user]);

  const closeTour = () => {
    localStorage.setItem("salonDashboardTourSeen", "true");
    setShowTour(false);
  };

  const nextTourStep = () => {
    if (tourStep >= tourSteps.length - 1) {
      closeTour();
      return;
    }
    setTourStep((prev) => prev + 1);
  };

  const prevTourStep = () => {
    if (tourStep > 0) {
      setTourStep((prev) => prev - 1);
    }
  };

  const todayAppointments = useMemo(() =>
      appointments?.filter((a) => 
        new Date(a.startTime || a.appointmentDateTime).toDateString() === new Date().toDateString()
      ) || [], [appointments]
  );

  const pendingRequests = useMemo(() => 
    appointments?.filter((a) => a.status === "Pending") || [], [appointments]
  );

  // 🚀 QUICK LINK CARDS CONFIGURATION
  const quickLinks = [
    { title: "Appointments", desc: "View incoming client bookings", path: "/salon-owner/appointments", icon: <FaCalendarAlt size={20} />, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { title: "Edit Profile", desc: "Change cover photo, phone, address", path: "/salon-owner/profile", icon: <FaStore size={20} />, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { title: "My Services", desc: "Update your pricing and duration", path: "/salon-owner/services", icon: <FaConciergeBell size={20} />, color: "bg-pink-50 text-pink-600 border-pink-100" },
    { title: "Products", desc: "Manage your salon products", path: "/salon-owner/products", icon: <FaProductHunt size={20} />, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { title: "Wallet & Top-up", desc: "Check balance and add money", path: "/salon-owner/billing", icon: <FaCreditCard size={20} />, color: "bg-purple-50 text-purple-600 border-purple-100" },
    { title: "Receipts", desc: "View your payment receipts", path: "/salon-owner/receipts", icon: <FaReceipt size={20} />, color: "bg-teal-50 text-teal-600 border-teal-100" },
    { title: "Messages", desc: "Chat with your clients", path: "/salon-owner/messages", icon: <FaCommentDots size={20} />, color: "bg-sky-50 text-sky-600 border-sky-100" },
    { title: "Reviews", desc: "See what customers say", path: "/salon-owner/reviews", icon: <FaStar size={20} />, color: "bg-yellow-50 text-yellow-600 border-yellow-100" },
    { title: "Analytics", desc: "View your performance stats", path: "/salon-owner/analytics", icon: <FaChartLine size={20} />, color: "bg-rose-50 text-rose-600 border-rose-100" },
    { title: "Post Video", desc: "Upload marketing videos", path: "/salon-owner/post-video", icon: <FaVideo size={20} />, color: "bg-orange-50 text-orange-600 border-orange-100" },
    { title: "My Videos", desc: "Manage uploaded videos", path: "/salon-owner/my-videos", icon: <FaPlayCircle size={20} />, color: "bg-red-50 text-red-600 border-red-100" },
    { title: "Settings", desc: "Account and platform settings", path: "/salon-owner/settings", icon: <FaCog size={20} />, color: "bg-slate-50 text-slate-600 border-slate-100" }
  ];

  const handleLinkClick = (e, path) => {
    const hasNoFunds = (user?.walletBalance === undefined || user?.walletBalance === null ? 0 : Number(user.walletBalance)) < 0.50 && !user?.isVerified;
    if (hasNoFunds && path !== "/salon-owner/billing" && path !== "/salon-owner/dashboard") {
      e.preventDefault();
      toast.error("Your wallet is empty. Please top up to continue.");
      setShowWalletModal(true);
    }
  };

  // 🚀 SMART GUIDED ASSISTANT SYSTEM
  const getAssistantGuide = () => {
    const balance = user?.walletBalance || 0;
    const hasNoServices = salonData && (!salonData.services || salonData.services.length === 0);

    if (balance < 0.50) {
      return {
        title: "Assistant: Top up required!",
        text: `Your wallet balance is current $${balance.toFixed(2)}. To ensure your salon remains active, please add at least $5.00 to your wallet.`,
        actionText: "Deposit Funds",
        isShare: false,
        path: "/salon-owner/billing",
        badge: "Urgent Action Required"
      };
    }
    if (hasNoServices) {
      return {
        title: "Assistant: Add your services!",
        text: "Your profile is funded but you haven't added any services yet. Add at least one service so clients can see what you do and book you.",
        actionText: "Add First Service",
        isShare: false,
        path: "/salon-owner/services",
        badge: "Setup Step 3"
      };
    }
    return {
      title: "Assistant: Your account is fully active!",
      text: "Everything is set up! Here is your public salon link. Copy it and share it with your clients on WhatsApp or social media to start receiving bookings.",
      actionText: "Copy Link",
      isShare: true, // 🚀 FLAG FOR COPY ACTION
      path: `${window.location.origin}/salon/${salonData?.slug}`,
      badge: "Optimization & Marketing"
    };
  };

  const guide = getAssistantGuide();

  // 🚀 COPY LINK TO CLIPBOARD FUNCTION
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(guide.path);
      setCopied(true);
      toast.success("Salon link copied to clipboard! 📋");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <FaSpinner className="animate-spin text-4xl text-primary-purple" />
    </div>
  );

  return (
    <div className="p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-purple to-purple-600 text-white p-8 rounded-3xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold">{t("salondashboard.welcomeBack", { name: salonData?.name || user?.name })}</h1>
            <p className="opacity-90 mt-2 text-lg">{t("salondashboard.summary")}</p>
          </div>
          <button
            type="button"
            onClick={() => { setTourStep(0); setShowTour(true); }}
            className="inline-flex items-center justify-center rounded-full bg-white/10 border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
          >
            Need help?
          </button>
        </div>
      </div>

      {showTour && (
        <div className="fixed bottom-6 right-4 left-4 md:right-8 md:left-auto z-50 max-w-md mx-auto md:mx-0 md:w-[360px] bg-white shadow-2xl ring-1 ring-black/10 rounded-3xl border border-gray-100 p-6 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary-purple font-black">Tour</p>
              <h2 className="text-xl font-black text-gray-900 mt-2">{tourSteps[tourStep].title}</h2>
            </div>
            <button onClick={closeTour} className="text-gray-400 hover:text-gray-700 transition">
              <FaTimes size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">{tourSteps[tourStep].description}</p>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={prevTourStep}
              disabled={tourStep === 0}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{tourStep + 1}</span>/
              <span>{tourSteps.length}</span>
            </div>
            <button
              type="button"
              onClick={nextTourStep}
              className="rounded-full bg-primary-purple text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700 transition"
            >
              {tourStep === tourSteps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      )}

      {/* 🚀 QUICK ACTION CARDS MOVED TO THE TOP (Requirement 3) */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, i) => (
            <Link 
              key={i} 
              to={link.path} 
              onClick={(e) => handleLinkClick(e, link.path)}
              className="group bg-white p-5 rounded-[2rem] border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all flex flex-col justify-between h-44 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl border ${link.color}`}>
                  {link.icon}
                </div>
                <FaArrowRight className="text-gray-300 group-hover:text-primary-purple group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-1">{link.title}</h4>
                <p className="text-gray-400 text-xs font-medium leading-normal">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 🚀 THE SMART GUIDED ASSISTANT CARD */}
      <div className="bg-white border-2 border-purple-50 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3 w-full md:w-2/3">
          <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
            {guide.badge}
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{guide.title}</h2>
          <p className="text-gray-500 text-base leading-relaxed font-medium">{guide.text}</p>
          
          {/* 🚀 DISPLAYING THE RAW PUBLIC LINK ON SCREEN */}
          {guide.isShare && (
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm font-bold text-primary-purple select-all mt-4 w-full break-all">
                {guide.path}
            </div>
          )}
        </div>
        
        {/* 🚀 DYNAMIC ACTION BUTTON */}
        {guide.isShare ? (
          <button 
            onClick={handleCopyLink}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap ml-auto md:ml-0"
          >
            {copied ? <FaCheck /> : <FaCopy />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        ) : (
          <Link to={guide.path} className="ml-auto md:ml-0">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
              {guide.actionText} &rarr;
            </button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t("salondashboard.todaysBookings"), value: todayAppointments.length },
          { label: t("salondashboard.pendingRequests"), value: pendingRequests.length },
          { label: "Wallet Balance", value: `$ ${user?.walletBalance?.toFixed(2) || "0.00"}` },
          { label: t("salondashboard.newReviews"), value: salonData?.reviews?.length || 0 },
        ].map((stat, i) => (
          <div key={i} className="backdrop-blur-lg bg-white/70 hover:bg-white/100 transition-all border border-gray-200/50 rounded-3xl p-6 shadow-sm hover:shadow-xl">
            <p className="text-gray-500 mb-2 font-semibold text-sm">{stat.label}</p>
            <p className="text-4xl font-black text-gray-800 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Calendar Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 backdrop-blur-xl bg-white/70 rounded-3xl shadow-md p-8 border border-gray-200/40">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">{t("salondashboard.todaysAppointments")}</h2>
            <Link to="/salon-owner/appointments" onClick={(e) => handleLinkClick(e, "/salon-owner/appointments")} className="text-primary-purple font-semibold hover:underline">{t("salondashboard.viewCalendar")}</Link>
          </div>
          <div className="space-y-4">
            {todayAppointments.length > 0 ? todayAppointments.map((appt) => (
              <div key={appt._id} className="flex items-center p-4 bg-gray-50/70 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="bg-primary-purple text-white px-4 py-2 rounded-xl font-bold">
                  {new Date(appt.startTime || appt.appointmentDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-semibold text-lg">{appt.customer?.name || appt.clientName}</p>
                  <p className="text-gray-500 text-sm">{appt.serviceName}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${appt.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {appt.status}
                </span>
              </div>
            )) : <p className="text-gray-500 text-center py-10 text-lg">{t("salondashboard.noAppointments")}</p>}
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-md p-8 border border-gray-200/40">
            <h2 className="text-2xl font-semibold mb-6">{t("salondashboard.quickActions")}</h2>
            <div className="space-y-4">
              {[
                { icon: FaCalendarPlus, label: t("salondashboard.addBooking"), link: "/salon-owner/profile" },
                { icon: FaRegComments, label: t("salondashboard.replyMessages"), link: "/salon-owner/messages" },
                { icon: FaRegStar, label: t("salondashboard.respondReviews"), link: "/salon-owner/reviews" },
              ].map((action, i) => (
                <Link key={i} to={action.link} onClick={(e) => handleLinkClick(e, action.link)} className="flex items-center space-x-4 p-4 hover:bg-gray-100 rounded-xl transition font-medium">
                  <action.icon className="text-primary-purple text-xl" />
                  <span className="text-lg">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== WALLET TOP-UP MODAL ==================== */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 text-3xl">
              <FaWallet />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Top Up Required</h2>
            <p className="text-gray-500 mb-8 leading-relaxed font-medium">
              Your wallet balance is currently empty. To access this feature and keep your salon active, please add funds to your wallet.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/salon-owner/billing" onClick={() => setShowWalletModal(false)}>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl">
                  Top Up Wallet Now
                </button>
              </Link>
              <button 
                onClick={() => setShowWalletModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SalonDashboardPage;