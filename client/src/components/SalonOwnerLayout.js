"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaBars,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaCommentDots,
  FaConciergeBell,
  FaStar,
  FaStore,
  FaTachometerAlt,
  FaTimes,
  FaSignOutAlt,
  FaCreditCard,
  FaVideo,
  FaPlayCircle,
  FaProductHunt,
  FaWallet,
  FaSpinner
} from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../context/AuthContext";
import { useMySalon } from "../api/swr"; // 🚀 Added to verify step 2 & 3

const SidebarLink = ({ to, icon: Icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] 
      tracking-wide transition-all duration-300 group
      ${
        isActive
          ? "bg-white/20 text-white shadow-md font-semibold backdrop-blur-md"
          : "text-gray-200 hover:bg-white/10 hover:text-white"
      }`
    }
  >
    <Icon size={18} className="opacity-90 group-hover:scale-110 transition-transform" />
    {children}
  </NavLink>
);

const SalonOwnerLayout = ({ children }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();

  // 🚀 Fetch current owner's salon profile
  const { data: salonData, isLoading: loadingSalon } = useMySalon();

  const isBillingPage = location.pathname.includes("billing");
  const isPaymentPage = location.pathname.includes("pay"); 
  const isProfilePage = location.pathname.includes("profile");
  const isServicesPage = location.pathname.includes("services");

  // 🚀 WALLET SYSTEM LOGIC (Replacing Subscription activePlan logic)
  const MIN_REQUIRED_FEE = 0.50; // The fee per booking ($0.50)

  // 🚀 FIXED: Fallback to 0 if walletBalance is undefined or null (Fixes new registration bypass)
  const currentBalance = user?.walletBalance !== undefined && user?.walletBalance !== null 
    ? Number(user.walletBalance) 
    : 0;
  
  // 🚀 STEP 1 CHECK: User is blocked if they have less than $0.50 and are not verified
  const hasNoFunds = currentBalance < MIN_REQUIRED_FEE && !user?.isVerified;

  // 🚀 STEP 2 CHECK: Has built a salon profile yet?
  const hasNoProfile = !salonData && !loadingSalon;

  // 🚀 STEP 3 CHECK: Has added at least 1 service?
  const hasNoServices = salonData && (!salonData.services || salonData.services.length === 0);

  // General Access State
  const hasNoAccess = hasNoFunds || hasNoProfile || hasNoServices;

  if (loadingSalon) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-primary-purple" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-slate-900 font-sans">
      
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-[70] bg-white shadow-lg p-3 rounded-full border border-purple-100"
        >
          <FaBars size={22} className="text-purple-700" />
        </button>
      )}

      {open && (
        <div 
          onClick={() => setOpen(false)} 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 z-[65] p-6 flex flex-col
          bg-gradient-to-b from-purple-800 to-purple-900 text-white transition-transform duration-500
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-2xl font-black tracking-tight">
            <span className="text-purple-200">Beauty</span>Heaven
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-300">
            <FaTimes size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
          <SidebarLink to="/salon-owner/dashboard" icon={FaTachometerAlt}>{t("ownerSidebar.dashboard")}</SidebarLink>
          <SidebarLink to="/salon-owner/appointments" icon={FaCalendarAlt}>{t("ownerSidebar.appointments")}</SidebarLink>
          <SidebarLink to="/salon-owner/profile" icon={FaStore}>{t("ownerSidebar.profile")}</SidebarLink>
          <SidebarLink to="/salon-owner/services" icon={FaConciergeBell}>{t("ownerSidebar.services")}</SidebarLink>
          <SidebarLink to="/salon-owner/products" icon={FaProductHunt}>{t("products")}</SidebarLink>
          
          <SidebarLink to="/salon-owner/billing" icon={FaCreditCard}>{t("ownerSidebar.billing")}</SidebarLink>
          
          <SidebarLink to="/salon-owner/messages" icon={FaCommentDots}>{t("ownerSidebar.messages")}</SidebarLink>
          <SidebarLink to="/salon-owner/reviews" icon={FaStar}>{t("ownerSidebar.reviews")}</SidebarLink>
          <SidebarLink to="/salon-owner/analytics" icon={FaChartLine}>{t("ownerSidebar.analytics")}</SidebarLink>
          
          <SidebarLink to="/salon-owner/post-video" icon={FaVideo}>{t("ownerSidebar.postVideo")}</SidebarLink>
          <SidebarLink to="/salon-owner/my-videos" icon={FaPlayCircle}>{t("ownerSidebar.myVideos")}</SidebarLink>
          
          <SidebarLink to="/salon-owner/settings" icon={FaCog}>{t("ownerSidebar.settings")}</SidebarLink>

          <button 
            onClick={logout} 
            className="w-full mt-6 flex items-center gap-3 px-4 py-3 rounded-xl text-purple-200 hover:bg-red-500/20 hover:text-red-100 transition-all font-bold"
          >
            <FaSignOutAlt size={18} /> {t("ownerSidebar.logout")}
          </button>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-white/10 text-white">
          <LanguageSwitcher />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 relative bg-[#FAF9F6]">
        {/* 🚨 STICKY LOW BALANCE ALERT BANNER (Doesn't block dashboard, just alerts) */}
        {hasNoFunds && !isBillingPage && !isPaymentPage && !isProfilePage && !isServicesPage && (
          <div className="bg-red-600 text-white py-3 px-6 text-center text-xs font-black uppercase tracking-[0.2em] shadow-lg sticky top-0 z-50 flex items-center justify-center gap-2 animate-pulse">
            ⚠️ Low Wallet Balance ($ {currentBalance.toFixed(2)}) &bull; 
            <Link to="/salon-owner/billing" className="underline ml-1">Top up now to avoid listing deactivation</Link>
          </div>
        )}

        {/* ==================== 🚀 THE GUIDED ONBOARDING SYSTEM ==================== */}
        {hasNoAccess && !isBillingPage && !isPaymentPage && !isProfilePage && !isServicesPage ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            
            {/* === STEP 1: TOP UP WALLET === */}
            {hasNoFunds && (
              <div className="max-w-xl w-full bg-white border-2 border-yellow-100 p-10 rounded-[3rem] shadow-2xl text-center animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 text-3xl">
                   <FaWallet />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Step 1: Top up Wallet</h2>
                <p className="text-gray-500 mt-4 text-lg leading-relaxed font-medium">
                    Your virtual wallet balance is empty ($ {currentBalance.toFixed(2)}). Please add at least <strong>$5.00</strong> to activate your business profile. Bookings cost $0.50 each.
                </p>
                <div className="mt-10">
                  <Link to="/salon-owner/billing">
                    <button className="bg-purple-600 text-white px-12 py-4 rounded-full font-black text-lg shadow-xl hover:bg-purple-700 hover:scale-105 transition-all">
                      Top up Wallet &rarr;
                    </button>
                  </Link>
                </div>
                <p className="text-gray-400 text-xs mt-6 font-bold uppercase tracking-widest">
                  Need help? Contact support@beautyheaven.site
                </p>
              </div>
            )}

            {/* === STEP 2: CREATE SALON PROFILE === */}
            {!hasNoFunds && hasNoProfile && (
              <div className="max-w-xl w-full bg-white border-2 border-purple-100 p-10 rounded-[3rem] shadow-2xl text-center animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-purple text-3xl">
                   <FaStore />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Step 2: Create Salon Profile</h2>
                <p className="text-gray-500 mt-4 text-lg leading-relaxed font-medium">
                    Wallet successfully funded! Now, build your business profile so clients can find your salon in the public directory map.
                </p>
                <Link to="/salon-owner/profile">
                  <button className="mt-8 bg-purple-600 text-white px-12 py-4 rounded-full font-black text-lg shadow-xl hover:bg-purple-700 hover:scale-105 transition-all">
                    Create Salon Profile &rarr;
                  </button>
                </Link>
              </div>
            )}

            {/* === STEP 3: ADD FIRST SERVICE === */}
            {!hasNoFunds && !hasNoProfile && hasNoServices && (
              <div className="max-w-xl w-full bg-white border-2 border-purple-100 p-10 rounded-[3rem] shadow-2xl text-center animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-purple text-3xl">
                   <FaConciergeBell />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Step 3: Add Your Services</h2>
                <p className="text-gray-500 mt-4 text-lg leading-relaxed font-medium">
                    Almost there! Please add at least one beauty service (haircut, manicure, etc.) so customers can book you.
                </p>
                <Link to="/salon-owner/services">
                  <button className="mt-8 bg-purple-600 text-white px-12 py-4 rounded-full font-black text-lg shadow-xl hover:bg-purple-700 hover:scale-105 transition-all">
                    Add My First Service &rarr;
                  </button>
                </Link>
              </div>
            )}

          </div>
        ) : (
          /* Render the actual page content (Dashboard, Billing, or Pay) */
          <div className="animate-in fade-in duration-700 h-full">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};

export default SalonOwnerLayout;