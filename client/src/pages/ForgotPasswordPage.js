"use client";

import React, { useState } from "react";
import { API } from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Added this
import { FaLock, FaStore, FaUser, FaKey, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPasswordPage = () => {
  const { t } = useTranslation(); // Initialize translation
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "", 
    salonName: "",  
    newPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword.length < 6) return toast.error(t("recovery.shortPassword"));

    setLoading(true);
    try {
      const { data } = await API.put("/api/users/self-reset-password", formData);
      toast.success(data.message || t("recovery.success"));
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4 py-12">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl border border-white relative overflow-hidden">
        
        <div className="text-center mb-8">
          <div className="bg-primary-purple text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
             <FaLock size={24} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {t("recovery.title")}
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            {t("recovery.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* USERNAME/EMAIL */}
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest ml-2 flex items-center gap-2">
              <FaUser className="text-primary-purple" /> {t("recovery.identifierLabel")}
            </label>
            <input 
              type="text" required 
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary-purple transition-all font-bold"
              onChange={(e) => setFormData({...formData, identifier: e.target.value})}
            />
          </div>

          {/* SECURITY CHECK: SALON NAME */}
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest ml-2 flex items-center gap-2">
              <FaStore className="text-primary-purple" /> {t("recovery.salonLabel")}
            </label>
            <input 
              type="text" required 
              placeholder={t("recovery.salonPlaceholder")}
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary-purple transition-all placeholder:text-gray-300 font-bold"
              onChange={(e) => setFormData({...formData, salonName: e.target.value})}
            />
          </div>

          {/* NEW PASSWORD WITH EYE ICON */}
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest ml-2 flex items-center gap-2">
              <FaKey className="text-pink-500" /> {t("recovery.passwordLabel")}
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary-purple transition-all pr-12 font-bold"
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-purple transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading} 
            className="w-full py-5 bg-gradient-to-r from-primary-purple to-primary-pink text-white rounded-full font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-4 flex items-center justify-center gap-3"
          >
            {loading ? <FaSpinner className="animate-spin" /> : t("recovery.button")}
          </button>
        </form>

        <p className="text-center text-gray-400 text-[10px] mt-8 font-bold uppercase tracking-widest">
           {t("recovery.footer")}
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;