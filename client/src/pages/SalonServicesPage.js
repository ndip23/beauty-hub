import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next"; // Added this
import { FaPlus, FaTrash, FaEdit, FaSpinner, FaStoreAlt } from "react-icons/fa";
import { useMySalon } from "../api/swr";
import { addService, updateService, deleteService } from "../api";
import { toast } from "react-toastify";
import Button from "../components/Button";
import ServiceModal from "../components/ServiceModal";
import { useNavigate } from "react-router-dom";

const SalonServicesPage = () => {
  const { t } = useTranslation(); // Initialize translation function
  const navigate = useNavigate();
  const { data: salonData, isLoading, mutate } = useMySalon();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const firstServiceCreatedRef = useRef(false);
  const previousServiceCountRef = useRef(salonData?.services?.length || 0);

  useEffect(() => {
    previousServiceCountRef.current = salonData?.services?.length || 0;
  }, [salonData?.services?.length]);

  const handleFormSubmit = async (serviceData) => {
    if (!salonData?._id) return toast.error("Create profile first.");

    const payload = {
      ...serviceData,
      currency: salonData.currency || "XAF" 
    };

    try {
      if (editingService) {
        await updateService(salonData._id, editingService._id, payload);
        toast.success(t("salonservices.updateSuccess"));
      } else {
        await addService(salonData._id, payload);
        toast.success(t("salonservices.addSuccess"));
        const previousCount = previousServiceCountRef.current;
        firstServiceCreatedRef.current = previousCount === 0;
      }

      await mutate();
      setIsModalOpen(false);
      setEditingService(null);

      if (!editingService && firstServiceCreatedRef.current) {
        navigate("/salon-owner/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save service");
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><FaSpinner className="animate-spin text-4xl text-primary-purple" /></div>;

  if (!salonData) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FaStoreAlt className="text-gray-200 text-7xl mb-6" />
        <h2 className="text-3xl font-bold tracking-tighter">{t("salonprofile.createTitle")}</h2>
        <p className="text-gray-500 mb-8">{t("salonprofile.basicInfoDesc")}</p>
        <Button onClick={() => navigate("/salon-owner/profile")} variant="gradient" className="rounded-full px-12">
           {t("salonprofile.createProfile")}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex justify-between items-center">
        {/* TRANSLATED HEADER */}
        <h1 className="text-3xl font-bold tracking-tight">{t("salonservices.header")}</h1>
        
        <Button 
          onClick={() => { setEditingService(null); setIsModalOpen(true); }} 
          className="flex items-center gap-2 rounded-full bg-primary-purple text-white hover:bg-primary-purple/80 px-6 py-3"
        >
          <FaPlus /> {t("salonservices.addButton")}
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-white shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F7] text-[10px] font-black uppercase tracking-widest text-gray-400">
            <tr>
              {/* TRANSLATED TABLE HEADERS */}
              <th className="p-6">{t("salonservices.table.name")}</th>
              <th className="p-6">{t("salonservices.table.price")}</th>
              <th className="p-6">{t("salonservices.table.duration")}</th>
              <th className="p-6 text-right">{t("salonservices.table.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {salonData.services?.map((service) => (
              <tr key={service._id} className="hover:bg-gray-50/50 transition-all">
                <td className="p-6 font-bold">{service.name}</td>
                <td className="p-6 font-black text-primary-purple">{service.price} {service.currency}</td>
                <td className="p-6 text-gray-500 text-sm">{service.duration} {t("salonservices.minutes")}</td>
                <td className="p-6 text-right">
                  <button onClick={() => { setEditingService(service); setIsModalOpen(true); }} className="p-2 text-blue-500"><FaEdit /></button>
                  <button onClick={() => deleteService(salonData._id, service._id).then(() => mutate())} className="p-2 text-red-400"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleFormSubmit} initialData={editingService} />}
    </div>
  );
};

export default SalonServicesPage;