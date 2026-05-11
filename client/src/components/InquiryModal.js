import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
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
    e.preventDefault();

    if (!formData.guestName || !formData.guestPhone || !formData.message) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);

    try {
      const response = await API.post(`/api/messages/${salonId}/inquiries`, {
        guestName: formData.guestName.trim(),
        guestPhone: formData.guestPhone.trim(),
        message: formData.message.trim(),
      });

      toast.success("Your message has been sent successfully! ✅");
      onClose();
      
      // Reset form
      setFormData({ guestName: "", guestPhone: "", message: "" });
    } catch (error) {
      console.error(error.message);
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[70vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold">Send Message</h2>
            <p className="text-gray-600 text-sm">To: {salonName}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-2xl text-gray-400 hover:text-gray-700 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Your Full Name</label>
              <input
                type="text"
                required
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Phone / WhatsApp Number</label>
              <input
                type="tel"
                required
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="+234 801 234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Your Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Hi, I would like to know more about your services and availability..."
              />
            </div>
          </form>
        </div>

        {/* Footer (Sticky) */}
        <div className="p-6 border-t bg-white sticky bottom-0">
          <Button 
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-purple-600 border-radius-10 text-white py-4 text-lg font-semibold"
          >
            {loading ? "Sending Message..." : "Send Message"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;