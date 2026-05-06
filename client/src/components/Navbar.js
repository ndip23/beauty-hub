"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaPlusCircle} from "react-icons/fa";
import LanguageSwitcher from "./LanguageSwitcher";

const NavItem = ({ to, children, onClick, highlight = false }) => (
  <li>
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block py-2 whitespace-nowrap transition-all duration-300 text-base lg:text-lg ${
          isActive
            ? "font-black text-primary-purple scale-105"
            : highlight 
              ? "font-bold text-primary-pink hover:text-primary-purple"
              : "font-semibold text-text-main hover:text-primary-pink"
        }`
      }
    >
      {children}
    </NavLink>
  </li>
);

const Navbar = ({ isLoggedIn, user, handleLogout }) => {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-[100]">
      <nav className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center gap-4">
        
        {/* 1. Logo (Shrinkable) */}
        <Link to="/" onClick={closeDrawer} className="text-2xl md:text-3xl font-black tracking-tighter shrink-0">
          <span className="bg-gradient-to-r from-primary-pink to-primary-purple text-transparent bg-clip-text">
            BeautyHeaven
          </span>
        </Link>

        {/* 2. Desktop Navigation (Hidden early to prevent French overlap) */}
        <ul className="hidden xl:flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              {user?.role === "salon_owner" ? (
                <>
                  <NavItem to="/salon-owner/dashboard">🚀 {t("ownerSidebar.portal")}</NavItem>
                  <NavItem to="/salon-owner/billing">💳 {t("ownerSidebar.billing")}</NavItem>
                  <NavItem to="/salon-owner/post-video" highlight>
                    <span className="flex items-center gap-1.5"><FaPlusCircle className="animate-pulse"/> {t("ownerSidebar.postVideo")}</span>
                  </NavItem>
                </>
              ) : (
                <>
                  <NavItem to="/salon-owner/dashboard">{t("ownerSidebar.portal")}</NavItem>
                  <NavItem to="/salon-owner/billing">{t("ownerSidebar.billing")}</NavItem>
                  <NavItem to="/salon-owner/post-video">{t("ownerSidebar.postVideo")}</NavItem>
                </>
              )}
              <li>
                    <NavLink
                      to="/video"
                      onClick={closeDrawer}
                      className="block py-2 font-bold text-primary-purple text-lg flex items-center gap-2"
                    >
                      Videos
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-pink"></span>
                      </span>
                    </NavLink>
                  </li>
              <li>
                    <NavLink
                      to="/promo"
                      onClick={closeDrawer}
                      className="block py-2 font-bold text-primary-purple text-lg flex items-center gap-2"
                    >
                      Promo Offer
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-pink"></span>
                      </span>
                    </NavLink>
                  </li>
            </>
          ) : (
            <>
              <NavItem to="/">{t("header.home")}</NavItem>
              <NavItem to="/become-salon-owner">{t("header.addBusiness")}</NavItem>
              <NavItem to="/promo" highlight>{t("header.promo")}</NavItem>
               <NavLink
                      to="/video"
                      onClick={closeDrawer}
                      className="block py-2 font-bold text-primary-purple text-lg flex items-center gap-2"
                    >
                      Videos
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-pink"></span>
                      </span>
                    </NavLink>
              <NavLink
                      to="/search"
                      onClick={closeDrawer}
                      className="block py-2 font-bold text-primary-purple text-lg flex items-center gap-2"
                    >
                      Search
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-pink"></span>
                      </span>
                    </NavLink>
            </>
          )}
        </ul>

        {/* 3. Right Actions (Switcher & User) */}
        <div className="hidden lg:flex items-center space-x-4 shrink-0">
          <LanguageSwitcher />
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4 bg-gray-50 p-1 pr-4 rounded-full border border-gray-100">
              <div className="w-9 h-9 rounded-full bg-primary-purple text-white flex items-center justify-center font-black text-xs shadow-md">
                {getInitials(user?.name)}
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
              >
                {t("header.logout")}
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="font-bold text-text-main hover:text-primary-purple text-sm">
                {t("login.signIn")}
              </Link>
              <Link to="/register">
                <button className="px-5 py-2.5 rounded-xl font-black text-sm text-white bg-primary-purple hover:bg-primary-pink shadow-lg shadow-purple-100 transition-all active:scale-95">
                  {t("login.createAccount")}
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* 4. Mobile Menu Button (Switch at XL now) */}
        <button onClick={toggleDrawer} className="xl:hidden p-2 text-primary-purple">
          {isDrawerOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </nav>

      {/* 5. Mobile Drawer */}
  {isDrawerOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white absolute w-full shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <ul className="flex flex-col space-y-4">
              {isLoggedIn ? (
                <>
                  <NavItem to="/salon-owner/dashboard">{t("ownerSidebar.portal")}</NavItem>
                  <NavItem to="/salon-owner/billing">{t("ownerSidebar.billing")}</NavItem>
                  <NavItem to="/salon-owner/post-video">{t("ownerSidebar.postVideo")}</NavItem>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeDrawer();
                    }}
                    className="w-full mt-4 px-5 py-2.5 rounded-lg font-bold text-white bg-gray-800 hover:bg-gray-900 transition-colors text-left"
                  >
                    {t("header.logout")}
                  </button>
                </>
              ) : (
                <>
                  <NavItem to="/" onClick={closeDrawer}>
                    {t("header.home")}
                  </NavItem>
                  <NavItem to="/become-salon-owner" onClick={closeDrawer}>
                    {t("header.addBusiness")}
                  </NavItem>
                  <li>
                    <NavLink
                      to="/video"
                      onClick={closeDrawer}
                      className="block py-2 font-bold text-primary-purple text-lg flex items-center gap-2"
                    >
                      Videos
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-pink"></span>
                      </span>
                    </NavLink>
                  </li>

                  {/* NEW PROMO LINK FOR MOBILE */}
                  <li>
                    <NavLink
                      to="/promo"
                      onClick={closeDrawer}
                      className="block py-2 font-bold text-primary-purple text-lg flex items-center gap-2"
                    >
                      Promo Offer
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-pink"></span>
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/search"
                      onClick={closeDrawer}
                      className="block py-2 font-bold text-primary-purple text-lg flex items-center gap-2"
                    >
                      Search
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-pink"></span>
                      </span>
                    </NavLink>
                  </li>
                  
                  <div className="h-px bg-gray-200 my-2"></div>

                  <NavItem to="/login" onClick={closeDrawer}>
                    {t("login.signIn")}
                  </NavItem>
                  <NavItem to="/register" onClick={closeDrawer}>
                    {t("login.createAccount")}
                  </NavItem>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;