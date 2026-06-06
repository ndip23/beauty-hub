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
  FaReceipt
} from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const SidebarLink = ({ to, icon: Icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={(e) => onClick && onClick(e, to)}
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
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();

  const isBillingPage = location.pathname.includes("billing");

  // WALLET SYSTEM LOGIC
  const currentBalance = user?.walletBalance !== undefined && user?.walletBalance !== null 
    ? Number(user.walletBalance) 
    : 0;
  
  const hasNoFunds = currentBalance < 0.50 && !user?.isVerified;

  const handleLinkClick = (e, path) => {
    if (window.innerWidth < 1024) setOpen(false);
    if (hasNoFunds && path !== "/salon-owner/billing" && path !== "/salon-owner/dashboard") {
      e.preventDefault();
      toast.error("Your wallet is empty. Please top up to continue.");
      setShowWalletModal(true);
    }
  };

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
          <Link to="/" className="flex items-center gap-2 bg-white p-2 rounded-xl">
            <img src="/logo.png" alt="Beautyhub Logo" className="h-10 object-contain" />
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-300">
            <FaTimes size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
          <SidebarLink onClick={handleLinkClick} to="/salon-owner/dashboard" icon={FaTachometerAlt}>{t("ownerSidebar.dashboard")}</SidebarLink>
          <SidebarLink onClick={handleLinkClick} to="/salon-owner/appointments" icon={FaCalendarAlt}>{t("ownerSidebar.appointments")}</SidebarLink>
          <SidebarLink onClick={handleLinkClick} to="/salon-owner/profile" icon={FaStore}>{t("ownerSidebar.profile")}</SidebarLink>
          <SidebarLink onClick={handleLinkClick} to="/salon-owner/services" icon={FaConciergeBell}>{t("ownerSidebar.services")}</SidebarLink>
          <SidebarLink onClick={handleLinkClick} to="/salon-owner/products" icon={FaProductHunt}>{t("products")}</SidebarLink>
          
          <SidebarLink onClick={handleLinkClick} to="/salon-owner/billing" icon={FaCreditCard}>{t("ownerSidebar.billing")}</SidebarLink>
          <SidebarLink onClick={handleLinkClick} to="/salon-owner/receipts" icon={FaReceipt}>Receipts</SidebarLink>
          
          <SidebarLink onClick={handleLinkClick} to="/salon-owner/messages" icon={FaCommentDots}>{t("ownerSidebar.messages")}</SidebarLink>
          <SidebarLink onClick={handleLinkClick} to="/salon-owner/reviews" icon={FaStar}>{t("ownerSidebar.reviews")}</SidebarLink>
          <SidebarLink onClick={handleLinkClick} to="/salon-owner/analytics" icon={FaChartLine}>{t("ownerSidebar.analytics")}</SidebarLink>
          
          <SidebarLink onClick={handleLinkClick} to="/salon-owner/post-video" icon={FaVideo}>{t("ownerSidebar.postVideo")}</SidebarLink>
          <SidebarLink onClick={handleLinkClick} to="/salon-owner/my-videos" icon={FaPlayCircle}>{t("ownerSidebar.myVideos")}</SidebarLink>
          
          <SidebarLink onClick={handleLinkClick} to="/salon-owner/settings" icon={FaCog}>{t("ownerSidebar.settings")}</SidebarLink>

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
        {/* 🚨 STICKY LOW BALANCE ALERT BANNER */}
        {hasNoFunds && !isBillingPage && (
          <div className="bg-red-600 text-white py-3 px-6 text-center text-xs font-black uppercase tracking-[0.2em] shadow-lg sticky top-0 z-50 flex items-center justify-center gap-2 animate-pulse">
            ⚠️ Low Wallet Balance ($ {currentBalance.toFixed(2)}) &bull; 
            <Link to="/salon-owner/billing" className="underline ml-1">Top up now to avoid listing deactivation</Link>
          </div>
        )}

        {/* ==================== DASHBOARD CONTENT ==================== */}
        <div className="animate-in fade-in duration-700 h-full">
          {children}
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
      </main>
    </div>
  );
};

export default SalonOwnerLayout;