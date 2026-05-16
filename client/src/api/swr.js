import useSWR from "swr";
import { apiClient } from "./index";

const fetcher = (url) => apiClient.get(url).then((res) => res.data);

// export const useSalons = (pageNumber = 1, keyword = "") => 
//   useSWR(`/api/salons?pageNumber=${pageNumber}&keyword=${keyword}`, fetcher);

export const useSalons = (pageNumber = 1, keyword = "", address = "", city = "", country = "") => {

  const queryParams = new URLSearchParams();
  
  queryParams.append("pageNumber", pageNumber);
  
  if (keyword?.trim()) queryParams.append("keyword", keyword.trim());
  if (address?.trim()) queryParams.append("address", address.trim());
  if (city?.trim()) queryParams.append("city", city.trim());
  // Added only the country parameter update below
  if (country?.trim()) queryParams.append("country", country.trim());

  const url = `/api/salons?${queryParams.toString()}`;

  return useSWR(url, fetcher, { keepPreviousData: true });
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