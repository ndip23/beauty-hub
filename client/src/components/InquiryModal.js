import React, { useState } from "react";
import { FaTimes, FaSpinner, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import Button from "./Button";
import { API } from "../api";

const InquiryModal = ({ isOpen, onClose, salonId, salonName }) => {
  const [formData, setFormData] = useState({
    guestName: "",
    guestPhone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.guestName.trim() || !formData.guestPhone.trim() || !formData.message.trim()) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);

    try {
      await API.post(`/api/messages/${salonId}/inquiries`, {
        guestName: formData.guestName.trim(),
        guestPhone: formData.guestPhone.trim(),
        message: formData.message.trim(),
      });
      toast.success("Your message has been sent successfully! ✅");
      
      // Reset and close
      setFormData({ guestName: "", guestPhone: "", message: "" });
      onClose();
    } catch (error) {
      console.error(error.message);
      toast.error(error.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-[2.5rem] max-w-md w-full shadow-2xl flex flex-col animate-in zoom-in duration-300">

        {/* Header */}
        <div className="px-8 py-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Send Message</h2>
            <p className="text-primary-purple font-bold text-xs uppercase tracking-widest mt-1">To: {salonName}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-all">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Your Full Name</label>
              <input
                type="text"
                required
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-purple outline-none font-bold"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Phone / WhatsApp</label>
              <input
                type="tel"
                required
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-purple outline-none font-bold"
                placeholder="+237 ..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Message</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-purple outline-none font-medium resize-none"
                placeholder="I'm interested in your services..."
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            variant="gradient"
            className="w-full !py-5 rounded-full text-lg font-black shadow-xl flex items-center justify-center gap-3 active:scale-95"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane size={18} />}
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;