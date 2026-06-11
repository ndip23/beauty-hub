"use client";

import { useTranslation } from "react-i18next";
import { FaArrowRight, FaChartLine, FaHeart, FaStore, FaWallet } from "react-icons/fa";
import { IoAnalyticsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-background.jpg";
import Button from "../components/Button";

const BecomeSalonOwnerPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white font-sans antialiased text-[#1D1D1F]">
      {/* ================= HERO ================= */}
      <section
        className="relative text-center flex items-center justify-center py-24 md:py-40 px-6 overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <div className="relative z-10 text-white max-w-4xl mx-auto">
          <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block border border-white/10">
            Grow Your Business With Booker Beauty
          </span>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight mb-6">
            Get More Clients For Your Salon
          </h1>

          <p className="text-lg md:text-2xl opacity-90 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            Booker Beauty helps salons, spas, barbershops, makeup artists, nail technicians, and beauty professionals attract new clients, manage operations, and increase revenue.
          </p>

          {/* Standout Hero CTA buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 mt-4">
            <Link to="/register">
              <Button
                variant="gradient"
                className="px-10 py-5 text-lg rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 font-black"
              >
                Create Account <FaArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY SECTION ================= */}
      <section className="py-24 px-6 bg-[#FAF9F6] border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16 tracking-tight">
            Why Choose Booker Beauty?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <FaStore />, 
                color: "text-pink-500 bg-pink-50 border-pink-100", 
                title: "Professional Profile", 
                desc: "Your profile acts as your direct business website, catalog, and price list so clients can book you instantly." 
              },
              { 
                icon: <FaWallet />, 
                color: "text-emerald-500 bg-emerald-50 border-emerald-100", 
                title: "Pay-As-You-Go", 
                desc: "No monthly subscriptions. You only pay a small commission of $0.05 when a customer contacts you." 
              },
              { 
                icon: <IoAnalyticsOutline />, 
                color: "text-purple-500 bg-purple-50 border-purple-100", 
                title: "Management Suite", 
                desc: "Get access to complete booking, employee, transaction, and client management tools at no extra cost." 
              },
              { 
                icon: <FaHeart />, 
                color: "text-blue-500 bg-blue-50 border-blue-100", 
                title: "Direct Connection", 
                desc: "Communicate directly with local clients via our integrated WhatsApp redirection and chat features." 
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-center flex flex-col items-center justify-between h-80"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border mb-6 ${item.color}`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight">{item.title}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-gradient-to-r from-purple-800 to-purple-900 text-white py-24 px-6 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-14 relative z-10">
          {[
            { num: "5,000+", text: "Verified Salons" },
            { num: "100K+", text: "Completed Bookings" },
            { num: "50K+", text: "Happy Customers" },
          ].map((it, i) => (
            <div key={i}>
              <p className="text-6xl font-black mb-3 tracking-tighter">{it.num}</p>
              <p className="text-lg text-purple-200 font-bold uppercase tracking-widest text-sm">{it.text}</p>
            </div>
          ))}
        </div>
        {/* Decorative background accent */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
          <span className="text-[40vw] font-black tracking-tighter uppercase italic">GROW</span>
        </div>
      </section>

      {/* ================= SECONDARY CTA ================= */}
      <section className="py-24 text-center px-6 bg-white border-b border-gray-100">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">
          Ready to Grow Your Beauty Business?
        </h2>
        <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto mb-10">
          Activate your account with a minimum deposit of $5.00 and start receiving direct WhatsApp booking inquiries today.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center max-w-md mx-auto">
          <Link to="/register">
            <Button
              variant="gradient"
              className="w-full !py-4 rounded-full flex items-center justify-center gap-2 font-black text-lg shadow-lg"
            >
              Create Account <FaArrowRight />
            </Button>
          </Link>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16 tracking-tight text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              { q: "How much does it cost to join?", a: "Creating an account is free. You can activate your profile and listing by depositing a minimum of $5 into your Booka Beauty wallet." },
              { q: "When am I charged?", a: "A service fee of only $0.02 is automatically deducted from your wallet whenever a customer contacts you through the platform. You only pay for performance!" },
              { q: "Can I manage my staff?", a: "Yes. Booka Beauty includes full employee management tools to assign staff roles, view individual schedules, and track activity." }
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
              >
                <h3 className="font-black text-lg text-gray-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeSalonOwnerPage;