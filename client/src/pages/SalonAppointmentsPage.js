import dayGridPlugin from "@fullcalendar/daygrid/index.js";
import interactionPlugin from "@fullcalendar/interaction/index.js";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid/index.js";
import { useState, useMemo } from "react"; // Added useMemo, removed useEffect
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaQuestionCircle, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"; 
import { updateAppointmentStatus } from "../api";
import { useMySalon, useSalonAppointments } from "../api/swr";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const SalonAppointmentsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Removed local events state to prevent the recursive infinite render loop
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: salon, isLoading: loadingSalon } = useMySalon();
  const {
    data: appointments = [],
    isLoading: loadingAppointments,
    error,
  } = useSalonAppointments(salon?._id);

  const loading = loadingSalon || loadingAppointments;

  // 🚀 WALLET SYSTEM CHECK: Replace subscription check
  const hasNoAccess = user && user.walletBalance < 0.50 && !user.isVerified;

  // 🚀 THE LOOP FIX: Compute events dynamically only when appointments change
  const events = useMemo(() => {
    if (!appointments) return [];
    return appointments.map((appt) => ({
      id: appt._id,
      title: `${appt.customer?.name || appt.clientName} - ${appt.serviceName || "Service"}`,
      start: appt.startTime || appt.appointmentDateTime,
      end: appt.endTime || appt.appointmentDateTime,
      extendedProps: { ...appt },
      backgroundColor:
        appt.status === "Confirmed"
          ? "#10B981"
          : appt.status === "Pending"
          ? "#F59E0B"
          : "#EF4444",
      borderColor:
        appt.status === "Confirmed"
          ? "#10B981"
          : appt.status === "Pending"
          ? "#F59E0B"
          : "#EF4444",
    }));
  }, [appointments]); // Only recalculates when the API data actually updates

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event.extendedProps);
  };

  const handleConfirm = async () => {
    if (!selectedEvent) return;
    try {
      await updateAppointmentStatus(selectedEvent._id, { status: "Confirmed" });
      
      setSelectedEvent((prev) => ({ ...prev, status: "Confirmed" }));
      toast.success(t("appointments.confirmed"));
      
      // Since SWR caches the results, we can trigger an SWR cache revalidation 
      // instead of manually modifying local array states, preventing inconsistencies.
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to confirm appointment:", error);
      toast.error(t("appointments.confirmFailed"));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-purple" />
      </div>
    );

  // 🚀 WALLET PROTECTION BLOCKADE (Replacing Subscription Block)
  if (hasNoAccess)
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white border-2 border-yellow-100 p-10 rounded-[3rem] shadow-2xl text-center">
        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 text-3xl">
           <FaExclamationTriangle />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Wallet Top-up Required</h2>
        <p className="text-gray-500 mt-4 text-lg leading-relaxed font-medium">
            Your virtual wallet balance is below the minimum required limit. Please top up your wallet to view your appointments calendar.
        </p>
        <Link to="/salon-owner/billing">
          <button className="mt-8 bg-purple-600 text-white px-12 py-4 rounded-full font-black text-lg shadow-xl hover:bg-purple-700 hover:scale-105 transition-all">
            Top up Wallet &rarr;
          </button>
        </Link>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100 max-w-xl mx-auto p-10">
        <h2 className="text-2xl font-black text-red-700">Connection Error</h2>
        <button onClick={() => window.location.reload()} className="mt-8 bg-red-600 text-white px-10 py-3 rounded-full font-black">Retry</button>
      </div>
    );

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-text-main mb-6">
        {t("appointments.title")}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            eventClick={handleEventClick}
            height="auto"
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">
            {t("appointments.details")}
          </h2>
          {selectedEvent ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                {selectedEvent.customer?.name || selectedEvent.clientName}
              </h3>
              <p
                className={`flex items-center space-x-2 text-sm font-semibold ${
                  selectedEvent.status === "Confirmed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {selectedEvent.status === "Confirmed" ? (
                  <FaCheckCircle />
                ) : (
                  <FaQuestionCircle />
                )}
                <span>
                  {t("appointments.status")}: {selectedEvent.status}
                </span>
              </p>
              <div className="border-t pt-4 space-y-3 text-text-muted">
                <p>
                  <strong>{t("appointments.service")}:</strong>{" "}
                  {selectedEvent.serviceName}
                </p>
                <p>
                  <strong>Phone Number:</strong>{" "}
                  {selectedEvent.customer?.phone || selectedEvent.clientNumber}
                </p>
                <p>
                  <strong>{t("appointments.time")}:</strong>{" "}
                  {new Date(selectedEvent.startTime || selectedEvent.appointmentDateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="border-t pt-4 flex space-x-2">
                {selectedEvent.status === "Pending" && (
                  <Button
                    variant="gradient"
                    className="!py-2 flex-1"
                    onClick={handleConfirm}
                  >
                    {t("appointments.confirm")}
                  </Button>
                )}
                <Button variant="secondary" className="!py-2 flex-1">
                  {t("appointments.reschedule")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-text-muted py-10">
              <p>{t("appointments.clickToView")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalonAppointmentsPage;