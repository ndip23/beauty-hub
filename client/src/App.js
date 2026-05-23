import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SWRConfig } from "swr";
import { getActiveSubscription } from "./api";
import { useAuth } from "./context/AuthContext";

// Layouts & Protected Routes
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import SalonOwnerLayout from "./components/SalonOwnerLayout";
import CustomerProtectedRoute from "./components/routing/CustomerProtectedRoute";
import SalonOwnerProtectedRoute from "./components/routing/SalonOwnerProtectedRoute";
import AdminProtectedRoute from "./components/routing/AdminProtectedRoute";

// Pages
import AdminLayout from "./components/AdminLayout";
import AboutPage from "./pages/AboutPage";
import AdminAppointments from "./pages/AdminAppointments";
import AdminCoupons from "./pages/AdminCoupons";
import AdminOverview from "./pages/AdminOverview";
import AdminPayments from "./pages/AdminPayments";
import AdminPlans from "./pages/AdminPlans";
import AdminSalons from "./pages/AdminSalons";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import AdminUsers from "./pages/AdminUsers";
import BeautyTipsPage from "./pages/BeautyTipsPage";
import BecomeSalonOwnerPage from "./pages/BecomeSalonOwnerPage";
import ComparePage from "./pages/ComparePage";
import ContactPage from "./pages/ContactPage";
import CustomerSettingsPage from "./pages/CustomerSettingsPage";
import DashboardPage from "./pages/DashboardPage";
import FavoritesPage from "./pages/FavoritesPage";
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import NearMePage from "./pages/NearMePage";
import PaymentPage from "./pages/PaymentPage";
import RegisterPage from "./pages/RegisterPage";
import SalonAnalyticsPage from "./pages/SalonAnalyticsPage";
import SalonAppointmentsPage from "./pages/SalonAppointmentsPage";
import SalonDashboardPage from "./pages/SalonDashboardPage";
import SalonDetailPage from "./pages/SalonDetailPage";
import SalonMessagesPage from "./pages/SalonMessagesPage";
import SalonProfilePage from "./pages/SalonProfilePage";
import SalonReviewsPage from "./pages/SalonReviewsPage";
import SalonServicesPage from "./pages/SalonServicesPage";
import SalonSettingsPage from "./pages/SalonSettingsPage";
import SalonsPage from "./pages/SalonsPage";
import Subscriptions from "./pages/Subscriptions";
import LandingPage from "./pages/LandingPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ReactPixel from "react-facebook-pixel";
import BasicPlanPay from "./pages/BasicPlanPay";
import AdOfferPage from "./pages/AdOfferPage";
import AdminPasswordManager from "./pages/AdminPasswordManager";
import SalonSearch from "./components/SalonSearch";
import VideoUpload from "./components/video/VideoUpload";
import Feed from "./components/video/VideoFeed";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import MyVideos from "./components/video/MyVideos";
import SalonProductsPage from "./pages/SalonProductPage";
import SalonShopPage from "./pages/SalonShariableLinkPage";
const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <>
      <Navbar isLoggedIn={!!user} user={user} handleLogout={logout} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
};

function App() {
  const { user, loading } = useAuth();
  const [activePlan, setActivePlan] = useState(null);
  const location = useLocation();

  // 1. FIXED: Added 'location' to dependency array as it's used inside
  useEffect(() => {
    const pixelId = '922516253909095'; 
    if (typeof window !== 'undefined' && !window.fb_initialized) {
      ReactPixel.init(pixelId, { autoConfig: true, debug: false });
      window.fb_initialized = true; 
    }
    ReactPixel.pageView();
  }, [location.pathname]); 

  // 2. FIXED: Added 'user' and 'user.role' to satisfy ESLint
  useEffect(() => {
    if (!user?._id || user?.role !== "salon_owner") {
      setActivePlan(null);
      return;
    }

    const getPlan = async () => {
      try {
        const response = await getActiveSubscription(user._id);
        setActivePlan(response.data?.data || response.data || null);
      } catch (err) {
        console.error("No active plan found");
        setActivePlan(null);
      }
    };
    getPlan();
  }, [user?._id, user?.role, location.pathname]); 

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-primary-purple animate-pulse">Loading System Architecture...</div>;
  }

  return (
    <SWRConfig value={{ revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 15000, errorRetryCount: 2 }}>
      <div className="font-sans">
        <ScrollToTop />
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          <Route
            path="/"
            element={
              !user ? (
                <MainLayout><HomePage /></MainLayout>
              ) : (
                <Navigate
                  to={
                    user.role === "admin"
                      ? "/admin/overview"
                      : user.role === "salon_owner" && activePlan
                      ? "/salon-owner/dashboard"
                      : user.role === "salon_owner" && (activePlan || user.isVerified)
                      ? "/salon-owner/billing"
                      : "/dashboard"
                  }
                  replace
                />
              )
            }
          />

          <Route path="/become-salon-owner" element={<MainLayout><BecomeSalonOwnerPage /></MainLayout>} />
          <Route path="/subscriptions" element={<MainLayout><Subscriptions /></MainLayout>} />
          <Route path="/tips" element={<MainLayout><BeautyTipsPage /></MainLayout>} />
          <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
          <Route path="/salons" element={<MainLayout><SalonsPage /></MainLayout>} />
          <Route path="/salon/:id" element={<MainLayout><SalonDetailPage /></MainLayout>} />
          <Route path="/payment" element={<MainLayout><PaymentPage /></MainLayout>} />
          <Route path="/promo" element={<MainLayout><LandingPage /></MainLayout>} />
          <Route path="/search" element={<MainLayout><SalonSearch /></MainLayout>} />
          <Route path="/video" element={<MainLayout><Feed /></MainLayout>} />
          <Route path="/terms" element={<MainLayout><TermsPage /></MainLayout>} />
          <Route path="/privacy" element={<MainLayout><PrivacyPage /></MainLayout>} />
<Route path="/shop/:slug" element={<MainLayout><SalonShopPage /></MainLayout>}  />
          <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
          <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
            <Route path="/pay-basic" element={<MainLayout><BasicPlanPay /></MainLayout>} />
            <Route path="/offer" element={<MainLayout><AdOfferPage /></MainLayout>} />
            <Route path="/forgot-password" element={<MainLayout><ForgotPasswordPage /></MainLayout>} />

          <Route element={<CustomerProtectedRoute />}>
            <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><CustomerSettingsPage /></MainLayout>} />
            <Route path="/favorites" element={<MainLayout><FavoritesPage /></MainLayout>} />
            <Route path="/compare" element={<MainLayout><ComparePage /></MainLayout>} />
            <Route path="/near-me" element={<MainLayout><NearMePage /></MainLayout>} />
          </Route>

          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="overview" element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="salons" element={<AdminSalons />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="plans" element={<AdminPlans />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="credentials" element={<AdminPasswordManager />} />
              <Route path="coupons" element={<AdminCoupons />} />
            </Route>
          </Route>

          <Route element={<SalonOwnerProtectedRoute />}>
            <Route path="/salon-owner/*" element={
              <SalonOwnerLayout activePlan={activePlan}>
                <Routes>
                  <Route path="dashboard" element={<SalonDashboardPage />} />
                  <Route path="appointments" element={<SalonAppointmentsPage />} />
                  <Route path="profile" element={<SalonProfilePage />} />
                  <Route path="products" element={<SalonProductsPage />} />
                  <Route path="services" element={<SalonServicesPage />} />
                  <Route path="messages" element={<SalonMessagesPage />} />
                  <Route path="reviews" element={<SalonReviewsPage />} />
                  <Route path="analytics" element={<SalonAnalyticsPage />} />
                  <Route path="settings" element={<SalonSettingsPage />} />
                  <Route path="post-video" element={<VideoUpload />} />
                  <Route path="my-videos" element={<MyVideos />} />
                   <Route path="billing" element={<Subscriptions />} /> 
                   <Route path="pay" element={<PaymentPage />} /> 
                </Routes>
              </SalonOwnerLayout>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </SWRConfig>
  );
}

export default App;