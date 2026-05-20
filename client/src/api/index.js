// src/api/index.js
import axios from "axios";

const isProduction = window.location.hostname !== "localhost";

const API_BASE_URL = isProduction 
  ? "https://beauty-heaven-api.vercel.app/"  
  : "http://localhost:8000";                

export const API = axios.create({ baseURL: API_BASE_URL });

export const apiClient = API; 

// --- INTERCEPTOR (KEEP THIS) ---
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- SALON API CALLS ---
export const fetchSalons = () => API.get("/api/salons");
export const fetchSalonById = (id) => API.get(`/api/salons/${id}`);
// Add more salon-related API calls here (e.g., create, update)

// --- AUTH API CALLS ---
export const loginUser = (formData) => API.post("/api/users/login", formData);
export const registerUser = (formData) => API.post("/api/users", formData);

// --- APPOINTMENT API CALLS ---
export const fetchSalon = (pageNumber = 1) => 
  API.get(`/api/salons?pageNumber=${pageNumber}`);
export const createSalon = (salonData) => API.post("/api/salons", salonData);
export const fetchMyApointments = () =>
  API.get("/api/appointments/myappointments");
export const createAppointment = (bookingData) =>
  API.post("/api/appointments", bookingData);
export const fetchSalonAppointments = (salonId) =>
  API.get(`/api/appointments/salon/${salonId}`);
export const updateAppointmentStatus = (id, data) =>
  API.put(`/api/appointments/${id}/status`, data);
export const updateMySalon = (id, data) => API.put(`/api/salons/${id}`, data);
export const addService = (salonId, serviceData) =>
  API.post(`/api/salons/${salonId}/services`, serviceData);
export const updateService = (salonId, serviceId, serviceData) =>
  API.put(`/api/salons/${salonId}/services/${serviceId}`, serviceData);
export const deleteService = (salonId, serviceId) =>
  API.delete(`/api/salons/${salonId}/services/${serviceId}`);
export const fetchSalonReviews = (salonId) =>
  API.get(`/api/salons/${salonId}/reviews`);
export const fetchSalonAnalytics = () => API.get("/api/analytics");
export const fetchMyMessages = () => API.get("/api/messages");
export const addReviewReply = (reviewId, replyData) =>
  API.put(`/api/reviews/${reviewId}/reply`, replyData);
export const updateUserProfile = (userData) =>
  API.put("/api/users/profile", userData);

export const subscribe = (data) =>
  API.post("/api/subscriptions/subscribe", data);

export const listSubscriptionPlans = () => API.get("/api/subscription-types");

export const getSubscriptionPlanById = (id) =>
  API.get(`/api/subscription-types/${id}`);

export const getActiveSubscription = (userId) =>
  API.get(`/api/subscriptions/${userId}/get-active-subscription`);

export const getPaymentStatus = (paymentId) =>
  API.get(`/api/payments/${paymentId}/check-payment-status`);
export const getPublicPlanPrice = (planId, countryCode) => 
  API.get(`/api/subscriptions/public-price/${planId}/${countryCode}`);


export const redeemCouponCode = (body) =>
  API.post("/api/subscriptions/redeem-coupon-code", body);
export const getPlanPrice = (planId, countryCode) => 
  API.get(`/api/subscriptions/price/${planId}/${countryCode}`);
export const createSubscriptionPlan = (data) => 
  API.post("/api/subscriptions/types", data);
export const updateSubscriptionPlan = (id, data) => 
  API.put(`/api/subscriptions/types/${id}`, data);
export const deleteSubscriptionPlan = (id) =>
   API.delete(`/api/subscriptions/types/${id}`);
// Fetch all user subscriptions for the admin list
export const getAdminOverview = () => 
  API.get("/api/admin/overview");

// Manually activate a user
export const manualActivate = (data) => 
  API.post("/api/admin/manual-activate", data);

// Suspend a user
export const restrictAccess = (userId) => 
  API.put(`/api/admin/restrict-access/${userId}`);
export const resetUserPassword = (data) =>
  API.put("/api/admin/reset-password", data);


export const getAdminStats = () => 
  API.get("/api/admin/stats"); // New endpoint for KPIs

// --- USER & SALON MGMT ---
export const getAllUsers = () => 
  API.get("/api/admin/users"); // Admin route for users
export const updateUserRole = (id, role) => 
  API.put(`/api/users/${id}/role`, { role });
export const blockUser = (id) => 
  API.put(`/api/users/${id}/block`);

// --- PAYMENTS & COUPONS ---
export const getAllPayments = () => 
  API.get("/api/payments"); 
export const getAllCoupons = () => 
  API.get("/api/subscriptions/coupons");
export const publicSubscribe = (data) => 
  API.post("/api/subscriptions/public-subscribe", data);
export const createCoupon = (data) => 
  API.post("/api/admin/create-coupon-code", data);

// --- APPOINTMENTS ---
export const getAllAppointments = () => 
  API.get("/api/appointments/admin/all");
export const addReview = (salonId, reviewData) => 
  API.post(`/api/salons/${salonId}/reviews`, reviewData);
export const fetchReviews = (salonId) => 
  API.get(`/api/salons/${salonId}/reviews`);
export const getPlanBySlug = (slug) => API.get(`api/subscription-types/slug/${slug}`);
export const getSalonBySlug = (slug) => API.get(`api/salons/s/${slug}`);

/** Add a new product to salon */
export const addProduct = (salonId, productData) =>
  API.post(`/api/salons/${salonId}/products`, productData);

/** Update an existing product */
export const updateProduct = (salonId, productId, productData) =>
  API.put(`/api/salons/${salonId}/products/${productId}`, productData);

/** Delete a product */
export const deleteProduct = (salonId, productId) =>
  API.delete(`/api/salons/${salonId}/products/${productId}`);

/** Get all products of a salon (Public) - Optional but useful */
export const getSalonProducts = (salonId) =>
  API.get(`/api/salons/${salonId}/products`);
export const getMyTransactions = (page = 1) => 
  API.get(`/api/transactions/my-transactions?page=${page}`);
export const getAllTransactionsForAdmin = (page = 1) => 
  API.get(`/api/admin/transactions?page=${page}`);