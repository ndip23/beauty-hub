"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  FaSpinner, 
  FaMapMarkerAlt, 
  FaImages, 
  FaTrash, 
  FaCamera, 
  FaCheckCircle 
} from "react-icons/fa";
import { useMySalon } from "../api/swr";
import { createSalon, updateMySalon } from "../api";
import { uploadToCloudinary } from "../utils/upload";
import { toast } from "react-toastify";
import Button from "../components/Button";


const SalonProfilePage = () => {
  const { t } = useTranslation(); 
  const { data: salon, isLoading, mutate } = useMySalon();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    phone: "",
    currency: "XAF",
    photos: [],
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (salon && !isInitialized) {
      setFormData({
        name: salon.name || "",
        description: salon.description || "",
        address: salon.address || "",
        city: salon.city || "",
        phone: salon.phone || "", // 🚀 Pre-populates the input from the DB
        currency: salon.currency || "XAF",
        photos: salon.photos || [],
      });
      setIsInitialized(true);
    }
  }, [salon, isInitialized]);

  const handleChange = (e) => {
    // 🚀 FIXED: Ensure the phone state is fully updated on keystroke
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        if (url) uploadedUrls.push(url);
      }
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uploadedUrls],
      }));
      toast.success("Photos synced to cloud!");
    } catch (error) {
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      return toast.error("Phone number is required");
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        phone: formData.phone.trim(), // 🚀 Explicitly send the phone number
        currency: formData.currency,
        photos: formData.photos
      };

      if (salon) {
        await updateMySalon(salon._id, payload);
        toast.success(t("salonprofile.updatedSuccess"));
        navigate("/salon-owner/dashboard");
      } else {
        await createSalon(payload);
        toast.success(t("salonprofile.createdSuccess"));
           navigate("/salon-owner/dashboard");
      }
      mutate();
    } catch (err) {
      toast.error(t("salonprofile.saveError"));
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen bg-[#F5F5F7]"><FaSpinner className="animate-spin text-4xl text-primary-purple" /></div>;

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="text-center lg:text-left">
        <h1 className="text-4xl font-black tracking-tighter text-[#1D1D1F]">
          {salon ? t("salonprofile.editTitle") : t("salonprofile.createTitle")}
        </h1>
        <p className="text-gray-500 mt-2 font-medium">{t("salonprofile.basicInfoDesc")}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* Basic Information Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-white shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t("salonprofile.salonName")}</label>
              <input name="name" value={formData.name} onChange={handleChange} required className="w-full p-5 bg-[#F5F5F7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-purple font-bold text-gray-800" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Local Currency</label>
              <select name="currency" value={formData.currency} onChange={handleChange} className="w-full p-5 bg-[#F5F5F7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-purple font-bold">
                <option value="XOF">XOF (Benin)</option>
                <option value="XOF">XOF (Burkina Faso)</option>
                <option value="XAF">XAF (Cameroon)</option>
                <option value="XAF">XAF (Congo Brazzaville)</option>
                <option value="CDF">CDF (Congo DRC)</option>
                <option value="XOF">XOF (Cote D'Ivoire)</option>
                <option value="XAF">XAF (Gabon)</option>
                <option value="GNF">GNF (Guinea Conakry)</option>
                <option value="INR">INR (India)</option>
                <option value="IDR">IDR (Indonesia)</option>
                <option value="KES">KES (Kenya)</option>
                <option value="MYR">MYR (Malaysia)</option>
                <option value="XOF">XOF (Mali)</option>
                <option value="XOF">XOF (Niger)</option>
                <option value="NGN">NGN (Nigeria)</option>
                <option value="PHP">PHP (Philippines)</option>
                <option value="RWF">RWF (Rwanda)</option>
                <option value="XOF">XOF (Senegal)</option>
                <option value="KRW">KRW (South Korea)</option>
                <option value="TZS">TZS (Tanzania)</option>
                <option value="THB">THB (Thailand)</option>
                <option value="XOF">XOF (Togo)</option>
                <option value="UGX">UGX (Uganda)</option>
                <option value="AED">AED (United Arab Emirates)</option>
                <option value="ZMW">ZMW (Zambia)</option>
                <option value="USD">USD (Dollar)</option>
              </select>
            </div>
          </div>
          
          {/* 🚀 FIXED: Bound value and handler properly */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t("salonprofile.phone")}</label>
            <input 
              name="phone" 
              type="tel"
              value={formData.phone} 
              onChange={handleChange} 
              required 
              className="w-full p-5 bg-[#F5F5F7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-purple font-bold text-gray-800 transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t("salonprofile.description")}</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-5 bg-[#F5F5F7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-purple font-medium text-gray-700 resize-none" />
          </div>
        </div>

        {/* Cloudinary Gallery Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-white shadow-sm space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-3"><FaImages className="text-pink-500" /> {t("salonprofile.photoGalleryTitle")}</h3>
          
          <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-[2.5rem] p-12 transition-all ${isUploading ? 'bg-purple-50 border-primary-purple' : 'bg-gray-50 border-gray-200 hover:border-primary-purple'}`}>
            {isUploading ? (
              <div className="text-center animate-pulse"><FaSpinner className="animate-spin text-4xl text-primary-purple mx-auto mb-4" /><p className="text-sm font-black text-gray-400 uppercase tracking-widest">Processing...</p></div>
            ) : (
              <label className="cursor-pointer text-center group">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform"><FaCamera className="text-primary-purple text-2xl" /></div>
                <p className="font-bold text-gray-800 text-lg">Click to select photos</p>
                <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            )}
          </div>

          {/* Instant Grid Previews */}
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-50">
              {formData.photos.map((url, index) => (
                <div key={index} className="relative group aspect-square rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
                  <img src={url} className="w-full h-full object-cover" alt="Gallery item" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removePhoto(index)} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-2xl"><FaTrash size={14} /></button>
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-1 rounded-full shadow-sm"><FaCheckCircle className="text-green-500 text-[10px]" /></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-white shadow-sm space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> {t("salonprofile.locationTitle")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="address" placeholder={t("salonprofile.address")} value={formData.address} onChange={handleChange} required className="w-full p-5 bg-[#F5F5F7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-purple font-bold text-gray-800" />
            <input name="city" placeholder={t("salonprofile.city")} value={formData.city} onChange={handleChange} required className="w-full p-5 bg-[#F5F5F7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-purple font-bold text-gray-800" />
          </div>
        </div>

        <Button type="submit" disabled={loading || isUploading} variant="gradient" className="w-full !py-6 text-xl rounded-full shadow-2xl transition-transform active:scale-95">
          {loading ? "Saving..." : salon ? t("salonprofile.saveChanges") : t("salonprofile.createProfile")}
        </Button>
      </form>
    </div>
  );
};

export default SalonProfilePage;