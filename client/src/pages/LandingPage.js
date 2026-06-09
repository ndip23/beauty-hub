"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FaCheckCircle, FaWallet, FaStore, FaConciergeBell, FaUsers, 
  FaRobot, FaReceipt, FaChartBar, FaEnvelope, FaChevronDown, 
  FaArrowRight, FaMobileAlt, FaCreditCard, FaStar 
} from "react-icons/fa";

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const steps = [
    { num: 1, icon: <FaUsers />, title: "Create Your Account", desc: "Sign up and create your business account in just a few minutes." },
    { num: 2, icon: <FaWallet className="text-emerald-500" />, title: "Activate Your Account", desc: "Load your Beautyhub Beauty wallet with a minimum of $5 to activate your account." },
    { num: 3, icon: <FaStore className="text-purple-500" />, title: "Set Up Your Business Profile", desc: "Complete your profile by adding your name, location, opening hours, and photos." },
    { num: 4, icon: <FaConciergeBell className="text-pink-500" />, title: "Add Your Services", desc: "List all the services you offer and set your own prices easily." },
    { num: 5, icon: <FaCheckCircle className="text-blue-500 animate-pulse" />, title: "Start Receiving Inquiries", desc: "Pay only $0.05 when a customer contacts you. You only pay when a customer reaches out!" }
  ];

  const features = [
    { icon: <FaRobot size={24} />, title: "AI Business Assistant", desc: "Generate marketing ideas, improve customer communication, create campaigns, and get instant business growth suggestions." },
    { icon: <FaReceipt size={24} />, title: "Professional Receipt Generator", desc: "Create printable and digital receipts for customers. Features transaction tracking, barcodes, and detailed sales records." },
    { icon: <FaChartBar size={24} />, title: "Business Management Dashboard", desc: "Manage daily operations from one place. Track appointments, service listings, business reporting, and performance." },
    { icon: <FaUsers size={24} />, title: "Employee Management", desc: "Manage your team with ease. Keep track of staff records, role assignments, individual performance, and activity logs." },
    { icon: <FaUsers size={24} />, title: "Customer Management", desc: "Keep track of all customer history, previous appointment records, and personal preferences in one secure database." },
    { icon: <FaEnvelope size={24} />, title: "Bulk Marketing Tools", desc: "Stay connected and promote your services directly via bulk SMS, Email, and WhatsApp campaign tools." }
  ];

  const faqs = [
    { q: "How much does it cost to join?", a: "You can create an account completely free and activate it by loading a minimum of $5 into your Beautyhub Beauty wallet." },
    { q: "When am I charged?", a: "A service fee of only $0.05 is deducted whenever a potential customer contacts you directly through the platform. You never pay a monthly subscription fee." },
    { q: "Can I manage my staff?", a: "Yes. Beautyhub Beauty includes a complete suite of employee management tools to track performance and assign roles." },
    { q: "Can I send promotions to customers?", a: "Absolutely. You can send bulk SMS, Email, and WhatsApp campaigns directly from your business control dashboard." },
    { q: "Is Beautyhub Beauty suitable for independent stylists?", a: "Yes. The platform is designed to scale from independent freelancers up to large multi-location beauty salons." }
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen font-sans antialiased text-[#1D1D1F] overflow-x-hidden">
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
              Welcome to the Future of Local Beauty
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-[-0.04em] leading-[1.1] mb-8">
              Get More Clients <br />
              For Your Salon With <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                BeautyHub.
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed mb-12">
            BeautyHub helps salons, spas, barbershops, makeup artists, nail technicians, and beauty professionals attract new clients, manage their businesses, and grow faster from one platform.
            </p>
          </motion.div>

          {/* Unified CTA Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-3xl mx-auto bg-white rounded-[2.5rem] md:rounded-[4rem] p-4 shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-white flex flex-col md:flex-row items-center gap-4 group"
          >
            <div className="bg-[#F5F5F7] w-full md:w-1/3 rounded-[2rem] md:rounded-[3rem] p-8 text-center md:text-left border border-gray-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-1 block">Pay-As-You-Go</span>
              <div className="flex items-baseline justify-center md:justify-start gap-1">
                <span className="text-5xl font-black">$0.05</span>
                <span className="text-gray-400 font-bold text-sm">/inquiry</span>
              </div>
              <p className="text-xs text-gray-400 font-bold mt-2">Activate wallet with just $5</p>
            </div>

            <div className="w-full md:w-2/3 p-4">
              <Link to="/register" className="w-full">
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-6 rounded-[2rem] text-xl font-black shadow-xl flex items-center justify-center gap-4 transform active:scale-95 transition-transform">
                  Create Your Account Today <FaArrowRight />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS SECTION ==================== */}
      <section className="py-24 bg-white border-y border-gray-100 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">How Beautyhub Beauty Works</h2>
            <p className="text-gray-500 font-medium text-lg mt-2">Five simple steps to unlock massive local business growth.</p>
          </div>

          <div className="space-y-12">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col md:flex-row items-start md:items-center gap-6 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl text-purple-600 shrink-0 font-bold">
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                     {step.title}
                  </h3>
                  <p className="text-gray-500 mt-1 font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURE SUITE SECTION ==================== */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">Everything Included with Your Account</h2>
            <p className="text-gray-500 font-medium text-lg mt-2 max-w-2xl mx-auto">Beautyhub Beauty is more than a client acquisition platform. You also get access to powerful business management tools at no additional cost.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between h-72 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 border border-purple-100">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-black text-xl text-gray-900 mb-2 leading-tight">{feature.title}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SUPPORTED PAYMENT METHODS ==================== */}
      <section className="py-24 bg-white px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">Supported Payment Methods</h2>
            <p className="text-gray-500 font-medium text-lg mt-2">Beautyhub Beauty supports the most popular payment methods across Africa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mobile Money */}
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <FaMobileAlt className="text-emerald-500" /> Mobile Money
              </h3>
              <ul className="grid grid-cols-2 gap-3 text-sm font-bold text-gray-500">
                <li>&bull; MTN Mobile Money</li>
                <li>&bull; Orange Money</li>
                <li>&bull; Airtel Money</li>
                <li>&bull; M-Pesa</li>
                <li>&bull; Tigo Pesa</li>
                <li>&bull; Airtel Tanzania</li>
              </ul>
            </div>

            {/* Cards & Banking */}
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <FaCreditCard className="text-purple-600" /> Cards & Banking
              </h3>
              <ul className="grid grid-cols-2 gap-3 text-sm font-bold text-gray-500">
                <li>&bull; Visa</li>
                <li>&bull; Mastercard</li>
                <li>&bull; Debit Cards</li>
                <li>&bull; Credit Cards</li>
                <li>&bull; Bank Transfer</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">What Beauty Professionals Are Saying</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Beautyhub Beauty helped us get more visibility online and manage our salon from one place.", author: "Stylist in Lusaka" },
              { text: "The platform is simple to use and the customer management tools save us hours every week.", author: "Salon Owner in Douala" },
              { text: "We love the AI assistant and the ability to communicate with our customers easily.", author: "Makeup Artist in Lagos" }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm text-center flex flex-col justify-between">
                <div className="flex justify-center text-yellow-400 gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => <FaStar key={idx} size={14} />)}
                </div>
                <p className="text-gray-600 text-sm font-medium italic mb-6">"{t.text}"</p>
                <p className="text-xs font-black uppercase tracking-wider text-gray-400">— {t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-100 rounded-3xl p-6 bg-gray-50/50">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center text-left font-black text-lg text-gray-900"
                >
                  <span>{faq.q}</span>
                  <FaChevronDown className={`text-gray-400 transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === index && (
                  <p className="mt-4 text-gray-500 font-medium text-sm leading-relaxed animate-in fade-in duration-300">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CALL TO ACTION ==================== */}
      <section className="py-24 px-6 bg-[#1D1D1F] text-white text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
            Ready To Grow Your <br /> Beauty Business?
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto mb-10">
            Join hundreds of beauty professionals using Beautyhub Beauty to attract new customers, manage their businesses, and increase their revenue.
          </p>
          <Link to="/register">
            <button className="bg-white text-gray-900 px-16 py-5 rounded-full font-black text-xl md:text-2xl shadow-2xl hover:scale-105 transition-transform active:scale-95">
              Create Your Account Now
            </button>
          </Link>
        </div>
        {/* Decorative background text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
          <span className="text-[40vw] font-black tracking-tighter uppercase italic">Beautyhub</span>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;