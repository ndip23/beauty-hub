import useSWR from "swr";
import { apiClient } from "./index";

const fetcher = (url) => apiClient.get(url).then((res) => res.data);

// 🚀 UPDATED: Clean, Optimized useSalons Hook
export const useSalons = (
  pageNumber = 1,
  keyword = "",
  address = "",
  city = "",
  country = "",
  lat = "",
  lng = "",
  radius = "30"
) => {
  const queryParams = new URLSearchParams();
  queryParams.append("pageNumber", pageNumber);

  if (keyword?.trim()) queryParams.append("keyword", keyword.trim());
  if (address?.trim()) queryParams.append("address", address.trim());
  if (city?.trim()) queryParams.append("city", city.trim());
  if (country?.trim()) queryParams.append("country", country.trim());
  
  // Convert lat and lng to strings before trimming to prevent crashes if they are numbers
  if (lat && String(lat).trim()) queryParams.append("lat", String(lat).trim());
  if (lng && String(lng).trim()) queryParams.append("lng", String(lng).trim());
  if (radius && String(radius).trim()) queryParams.append("radius", String(radius).trim());

  const url = `/api/salons?${queryParams.toString()}`;

  // 🚀 FIXED: SWR only makes the call if the country has been resolved or there is a keyword
  // This completely stops the "flicker" and duplicate salon results on the home page.
  const shouldFetch = country?.trim() !== "" || keyword?.trim() !== "" || (lat && lng);
  const key = shouldFetch ? url : null;

  return useSWR(key, fetcher, { keepPreviousData: true });
};

export const useSalon = (id) =>
  useSWR(id ? `/api/salons/${id}` : null, fetcher);

export const useSubscriptionPlans = () =>
  useSWR("/api/subscription-types", fetcher);

export const useMyConversations = () => 
  useSWR("/api/messages/mysalon/conversations", fetcher);

export const useSubscriptionPlan = (id) =>
  useSWR(id ? `/api/subscription-types/${id}` : null, fetcher);

export const useSalonReviews = (salonId) =>
  useSWR(salonId ? `/api/salons/${salonId}/reviews` : null, fetcher);

export const useSalonAnalytics = () => useSWR("/api/analytics", fetcher);

export const useMessages = () => useSWR("/api/messages", fetcher);

export const useMySalon = () => useSWR("/api/salons/mysalon", fetcher);

export const useSalonBySlug = (slug) =>
  useSWR(slug ? `/api/salons/s/${slug}` : null, fetcher);

export const useSalonAppointments = (salonId) =>
  useSWR(
    salonId ? `/api/appointments/salon/${salonId}` : null,
    fetcher
  );

export const useActiveSubscription = (userId) =>
  useSWR(
    userId ? `/api/subscriptions/${userId}/get-active-subscription` : null,
    fetcher
  );

export const useAdminStats = () => useSWR("/api/admin/stats", fetcher);
export const useAdminSalons = () => useSWR("/api/admin/salons", fetcher);
export const useAdminUsers = () => useSWR("/api/admin/users", fetcher);
export const useAdminAppointments = () => useSWR("/api/admin/appointments", fetcher);
export const useAdminOverview = () => useSWR("/api/admin/overview", fetcher);
export const useAdminSubscriptions = () => useSWR("/api/admin/overview", fetcher);