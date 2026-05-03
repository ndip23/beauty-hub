"use client";

import { useEffect, useState } from "react";
import { FaSpinner, FaGlobe, FaLock, FaPhoneAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next"; // Added this
import { getPlanBySlug, publicSubscribe, getPublicPlanPrice } from "../api"; 
import Button from "../components/Button";
import { toast } from "react-toastify";

const SUPPORTED_REGIONS = [
  { name: "Benin", code: "BJ", currency: "XOF" },
  { name: "Burkina Faso", code: "BF", currency: "XOF" },
  { name: "Cameroon", code: "CM", currency: "XAF" },
  { name: "Congo Brazzaville", code: "CG", currency: "XAF" },
  { name: "Congo DRC", code: "CD", currency: "CDF" },
  { name: "Cote D'Ivoire", code: "CI", currency: "XOF" },
  { name: "Gabon", code: "GA", currency: "XAF" },
  { name: "Guinea Conakry", code: "GN", currency: "GNF" },
  { name: "India", code: "IN", currency: "INR" },
  { name: "Indonesia", code: "ID", currency: "IDR" },
  { name: "Kenya", code: "KE", currency: "KES" },
  { name: "Malaysia", code: "MY", currency: "MYR" },
  { name: "Mali", code: "ML", currency: "XOF" },
  { name: "Niger", code: "NE", currency: "XOF" },
  { name: "Nigeria", code: "NG", currency: "NGN" },
  { name: "Philippines", code: "PH", currency: "PHP" },
  { name: "Rwanda", code: "RW", currency: "RWF" },
  { name: "Senegal", code: "SN", currency: "XOF" },
  { name: "South Korea", code: "KR", currency: "KRW" },
  { name: "Tanzania", code: "TZ", currency: "TZS" },
  { name: "Thailand", code: "TH", currency: "THB" },
  { name: "Togo", code: "TG", currency: "XOF" },
  { name: "Uganda", code: "UG", currency: "UGX" },
  { name: "United Arab Emirates", code: "AE", currency: "AED" },
  { name: "Zambia", code: "ZM", currency: "ZMW" },
  { name: "International", code: "US", currency: "USD" },
];

const BasicPlanPay = () => {
  const { t } = useTranslation(); // Initialize translation
  const BASIC_PLAN_SLUG = "basic-plan";
  const PROMO_USD_PRICE = 5; 

  const [plan, setPlan] = useState(null);
  const [phone, setPhone] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [fetchingPlan, setFetchingPlan] = useState(true);
  
  const [selectedRegion, setSelectedRegion] = useState(SUPPORTED_REGIONS[0]);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [fetchingRate, setFetchingRate] = useState(false);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        setFetchingPlan(true);
        const { data } = await getPlanBySlug(BASIC_PLAN_SLUG);
        setPlan(data.data);
      } catch (err) {
        toast.error(t("basicPay.errorPlan"));
      } finally {
        setFetchingPlan(false);
      }
    };
    loadPlan();
  }, [t]);

  useEffect(() => {
    const fetchRate = async () => {
      if (!plan) return;
      if (selectedRegion.code === "US") {
        setExchangeRate(1);
        return;
      }
      try {
        setFetchingRate(true);
        const { data } = await getPublicPlanPrice(BASIC_PLAN_SLUG, selectedRegion.code);
        if (data.success) {
            setExchangeRate(data.data.rate);
        }
      } catch (err) {
        const fallbacks = { "NG": 1600, "CM": 655, "BF": 655 };
        setExchangeRate(fallbacks[selectedRegion.code] || 655);
      } finally {
        setFetchingRate(false);
      }
    };
    fetchRate();
  }, [selectedRegion, plan]);

  const handlePay = async () => {
    if (!phone.trim()) return toast.error(t("basicPay.errorPhone"));

    setLoading(true);
    try {
      const response = await publicSubscribe({
        planId: BASIC_PLAN_SLUG,
        countryCode: selectedRegion.code,
        currency: selectedRegion.currency,
        phone: phone.trim()
      });

      if (response.data?.success && response.data?.data?.paymentUrl) {
        window.location.href = response.data.data.paymentUrl;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t("basicPay.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const localAmount = Math.ceil(PROMO_USD_PRICE * exchangeRate);

  if (fetchingPlan) return <div className="h-screen flex items-center justify-center"><FaSpinner className="animate-spin text-4xl text-primary-purple" /></div>;

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 border border-white">
        
        <div className="text-center mb-8">
          <div className="bg-primary-purple text-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
             <FaLock size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t("basicPay.title")}</h1>
          <p className="text-gray-500 mt-2 font-medium italic">{t("basicPay.promoTag")}</p>
        </div>

        <div className="mb-6">
          <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest ml-2 flex items-center gap-2">
            <FaPhoneAlt className="text-primary-purple" /> {t("basicPay.phoneLabel")}
          </label>
          <input 
            type="tel" 
            placeholder={t("basicPay.phonePlaceholder")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-5 bg-[#F5F5F7] rounded-2xl font-bold border-2 border-transparent focus:border-primary-purple outline-none transition-all"
          />
        </div>

        <div className="mb-8">
          <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest ml-2 flex items-center gap-2">
            <FaGlobe className="text-blue-500" /> {t("basicPay.locationLabel")}
          </label>
          <select 
            value={selectedRegion.code}
            onChange={(e) => setSelectedRegion(SUPPORTED_REGIONS.find(r => r.code === e.target.value))}
            className="w-full p-5 bg-[#F5F5F7] rounded-2xl font-bold border-2 border-transparent focus:border-primary-purple outline-none transition-all cursor-pointer appearance-none"
          >
            {SUPPORTED_REGIONS.map((r) => (
              <option key={r.code} value={r.code}>{r.name} ({r.currency})</option>
            ))}
          </select>
        </div>

        <div className="bg-[#1D1D1F] rounded-[2.5rem] p-10 text-white text-center mb-8 shadow-inner relative overflow-hidden">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">{t("basicPay.totalLabel")}</p>
          {fetchingRate ? (
            <FaSpinner className="animate-spin mx-auto text-3xl z-10" />
          ) : (
            <h2 className="text-5xl font-black tracking-tighter relative z-10">
              <span className="text-xl text-primary-pink mr-2">{selectedRegion.currency}</span>
              {localAmount.toLocaleString()}
            </h2>
          )}
          <div className="absolute -bottom-4 -right-4 text-white/5 font-black text-9xl select-none">$</div>
        </div>

        <Button
          variant="gradient"
          onClick={handlePay}
          disabled={loading || fetchingRate}
          className="w-full !py-6 rounded-full text-xl font-black shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          {loading ? <FaSpinner className="animate-spin" /> : t("basicPay.btnPay")}
        </Button>
      </div>
    </div>
  );
};

export default BasicPlanPay;