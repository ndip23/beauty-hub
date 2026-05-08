// File: client/src/pages/LandingPage.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Footer from '../components/Footer';

// This is the complete, new landing page component.
const LandingPage = () => {

  const SectionTitle = ({ children }) => (
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center">
      {children}
    </h2>
  );
  

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">

      {/* SECTION 1: HERO */}
      <section className="relative pt-24 pb-16 px-6 bg-gray-50 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight mb-6">
              Get More Beauty Clients Without Paying for a Shop
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              List your beauty business online and start receiving bookings directly on WhatsApp from people in your area.
            </p>
            <Link to="/register">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-transform hover:scale-105 shadow-lg">
                Register Now & Start Getting Clients for just $2
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: VIDEO */}
      <section className="py-20 px-6">
  <div className="max-w-5xl mx-auto">
    {/* The video container maintains the aspect ratio and rounded corners */}
    <div className="aspect-video w-full bg-black rounded-2xl shadow-xl overflow-hidden">
      <video
        className="w-full h-full object-cover"
        src="/videos/ad-video.mp4" // Path to your video in the public folder
        autoPlay // The video will start playing automatically
        loop     // The video will loop continuously
        muted    // IMPORTANT: Videos must be muted to autoplay in most browsers
        playsInline // Ensures video plays inline on iOS devices
        controls
      >
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</section>

      {/* SECTION 3: BENEFITS */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <SectionTitle>Why Join Beauty Heaven Directory?</SectionTitle>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Get clients in your area",
              "No need to pay expensive shop rent",
              "Offer home services easily",
              "Get direct bookings through WhatsApp",
              "Grow your business faster"
            ].map((benefit, i) => (
              <div key={i} className="flex items-start space-x-4">
                <FaCheckCircle className="text-purple-500 text-2xl mt-1 flex-shrink-0" />
                <p className="text-lg text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionTitle>How It Works</SectionTitle>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-gray-300 transform -translate-y-1/2"></div>
            
            {[
              { num: 1, text: "Register your beauty business" },
              { num: 2, text: "We list and promote your services in your area" },
              { num: 3, text: "Clients find you and contact you on WhatsApp" },
              { num: 4, text: "You get booked and paid" }
            ].map((step) => (
              <div key={step.num} className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-4 border-4 border-white shadow-md">{step.num}</div>
                <p className="font-semibold text-gray-700">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* SECTION 5 & 6: OFFER & URGENCY */}
      <section className="py-20 px-6 bg-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Start Getting Clients Today</h2>
          <p className="text-lg text-purple-200 mt-4 max-w-2xl mx-auto">
            Join Beauty Heaven Directory and make your business visible online. This limited-time offer is for new members only. The earlier you join, the faster you start getting clients.
          </p>
          <div className="mt-10 bg-white text-gray-800 rounded-xl p-8 max-w-md mx-auto shadow-2xl">
            <p className="text-lg font-medium line-through text-gray-400">Subscription fee: $30 per month</p>
            <p className="text-5xl font-extrabold text-purple-600 my-2">$2</p>
            <p className="text-xl font-bold">For Your First Month</p>
          </div>
        </div>
      </section>
      
      {/* SECTION 7: REGISTRATION FORM */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <SectionTitle>Register Your Business</SectionTitle>
          <form className="mt-12 space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="fullName" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
              <input type="text" id="businessName" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
              <input type="tel" id="whatsapp" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>
             <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">Service Type</label>
              <select id="serviceType" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white">
                  <option>Hair</option>
                  <option>Nails</option>
                  <option>Spa</option>
                  <option>Makeup</option>
                  <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (Area/City)</label>
              <input type="text" id="location" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
             <Link to="/register">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-transform hover:scale-105 shadow-lg">
                        Register Now & start getting clients
                    </button>
                </Link>
            </div>
          </form>
        </div>
      </section>

      {/* SECTION 8 & 9: TRUST & FINAL CTA */}
       <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
            <SectionTitle>Built for Beauty Professionals</SectionTitle>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6">
                We help hairstylists, nail technicians, makeup artists, and spa professionals grow their business by connecting them with real clients in their area. Don’t stay invisible. Let clients find you.
            </p>
             <div className="mt-10">
                <Link to="/register">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-transform hover:scale-105 shadow-lg">
                        Register Now
                    </button>
                </Link>
            </div>
        </div>
      </section>
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/+237687950618" // <-- IMPORTANT: Replace with your number
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-transform hover:scale-110 z-50"
      >
        <FaWhatsapp size={30} />
      </a>

      <Footer />
    </div>
  );
};

export default LandingPage;