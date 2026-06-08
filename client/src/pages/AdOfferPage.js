"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaCheckCircle, FaRocket, FaMagic, FaGift } from "react-icons/fa";
import { useTranslation } from "react-i18next"; // Added this

const AdOfferPage = () => {
  const { t } = useTranslation(); // Initialize translation

  // === WHATSAPP CONFIGURATION ===
  const whatsappNumber = "237687950618";
  const customMessage = "Hello Beautyhub team! I saw your Skincare/Beauty business offer for $5 and I want to get more customers online. Please help me create my professional profile and start my FREE month of promotion.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}`;

  return (
    <div className="bg-[#F5F5F7] min-h-screen font-sans antialiased text-[#1D1D1F] overflow-x-hidden">
      
      {/* 1. TIGHT NAVIGATION BAR 
      <nav className="fixed top-0 w-full z-[100] bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary-purple transition-colors"
          >
            <FaArrowLeft /> {t("offerPage.back")}
          </Link>
          <span className="font-black tracking-tighter text-base text-primary-purple">Beautyhub</span>
          <div className="w-8"></div>
        </div>
      </nav>*/}

      <main className="max-w-4xl mx-auto px-4 pt-16 pb-20">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-6xl font-black tracking-[-0.04em] leading-tight mb-4 text-gray-900">
            {t("offerPage.titleMain")} <br />
            <span className="bg-gradient-to-r from-primary-purple to-pink-500 bg-clip-text text-transparent">
              {t("offerPage.titleSub")}
            </span>
          </h1>
          <p className="text-base md:text-xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed px-2">
            {t("offerPage.intro")}
          </p>

          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mt-6 flex justify-center"
          >
            <a 
              href={whatsappUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white py-4 px-10 rounded-full font-black text-lg shadow-xl flex items-center gap-3 active:scale-95 transition-transform"
            >
              <FaWhatsapp size={24} /> {t("offerPage.btnStart")}
            </a>
          </motion.div>
        </motion.div>

        {/* 3. THE INFO CARD */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative bg-white rounded-[2rem] shadow-sm border border-white overflow-hidden p-8 md:p-12 mb-10"
        >
          <h2 className="text-xl md:text-3xl font-black tracking-tight mb-6 leading-tight text-center md:text-left text-gray-900">
            {t("offerPage.cardTitle")} <span className="text-primary-purple italic">{t("offerPage.cardItalic")}</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                  t("offerPage.features.profile"),
                  t("offerPage.features.catalog"),
                  t("offerPage.features.prices"),
                  t("offerPage.features.booking")
              ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#F5F5F7] p-3 rounded-xl">
                      <FaCheckCircle className="text-green-500 shrink-0 text-sm" />
                      <span className="font-bold text-gray-700 text-sm">{text}</span>
                  </div>
              ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center">
             <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-1">{t("offerPage.feeLabel")}</p>
             <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-black">$5</span>
                  <span className="text-gray-400 font-bold line-through text-lg">$25</span>
              </div>
          </div>
        </motion.div>

        {/* 4. TIGHT TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-[1.5rem] border border-white shadow-sm text-center">
                <FaGift className="text-pink-500 text-2xl mx-auto mb-2" />
                <h4 className="font-black text-lg text-gray-900">{t("offerPage.promoTitle")}</h4>
                <p className="text-gray-500 text-xs font-medium">{t("offerPage.promoDesc")}</p>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] border border-white shadow-sm text-center">
                <FaRocket className="text-primary-purple text-2xl mx-auto mb-2" />
                <h4 className="font-black text-lg text-gray-900">{t("offerPage.listingTitle")}</h4>
                <p className="text-gray-500 text-xs font-medium">{t("offerPage.listingDesc")}</p>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] border border-white shadow-sm text-center">
                <FaMagic className="text-blue-500 text-2xl mx-auto mb-2" />
                <h4 className="font-black text-lg text-gray-900">{t("offerPage.effortTitle")}</h4>
                <p className="text-gray-500 text-xs font-medium">{t("offerPage.effortDesc")}</p>
            </div>
        </div>

      </main>

      <footer className="pb-10 text-center text-gray-400">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Beautyhub &copy; 2024</p>
      </footer>
    </div>
  );
};

export default AdOfferPage;