// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useLocation } from "react-router-dom";
// import { FaFilter, FaSearch, FaSpinner, FaArrowLeft, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
// import { useSalons } from "../api/swr";
// import SalonCard from "../components/SalonCard";

// const SalonsPage = () => {
//   const { t } = useTranslation();
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//   const keyword = queryParams.get("keyword") || "";
//   const [pageNumber, setPageNumber] = useState(1); // BOSS REQUIREMENT: PAGINATION
//   const [salons, setSalons] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);

//    const { data: salonsData, isLoading: loading, error, mutate } = useSalons(pageNumber, keyword);

//   useEffect(() => {
//     // Correctly extract the array from the paginated object
//     if (salonsData?.salons) {
//       setSalons(salonsData.salons);
//     }
//   }, [salonsData]);

//   return (
//     <div className="bg-white min-h-screen pb-20">
//       <section className="bg-[#1D1D1F] text-white py-16 px-6">
//         <div className="container mx-auto">
//           <h1 className="text-5xl font-black tracking-tighter mb-4">{t("salons.header")}</h1>
//           <p className="text-gray-400 text-lg">{t("salons.discover", { count: salonsData?.totalSalons || 0 })}</p>
//         </div>
//       </section>

//       <section className="bg-white border-b sticky top-0 z-40 py-4 px-6 shadow-sm">
//         <div className="container mx-auto flex gap-4">
//            <div className="flex-1 relative">
//               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
//               <input type="text" placeholder={t("salons.searchPlaceholder")} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-purple outline-none font-medium" />
//            </div>
//            <button onClick={() => setShowFilters(!showFilters)} className="px-6 bg-gray-50 rounded-2xl font-bold flex items-center gap-2"><FaFilter /> {t("salons.filters")}</button>
//         </div>
//       </section>

//       <div className="container mx-auto px-6 py-12">
//         {loading ? (
//           <div className="text-center py-20"><FaSpinner className="animate-spin text-5xl text-primary-purple mx-auto" /></div>
//         ) : error ? (
//           /* BOSS REQUIREMENT: IMPROVED ERROR HANDLING */
//           <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100 max-w-xl mx-auto p-10">
//             <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
//             <h2 className="text-2xl font-black text-red-700 leading-tight">Server Connection Error</h2>
//             <p className="text-red-600 mt-2">The system is taking a bit long to respond. This usually happens when the backend is waking up.</p>
//             <button onClick={() => mutate()} className="mt-8 bg-red-600 text-white px-10 py-3 rounded-full font-black shadow-lg">Retry Connection</button>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//               {salons.map((salon) => <SalonCard key={salon._id} salon={salon} />)}
//             </div>

//             {/* BOSS REQUIREMENT: PAGINATION UI */}
//             {salonsData?.pages > 1 && (
//               <div className="mt-20 flex justify-center items-center gap-6">
//                 <button 
//                   disabled={pageNumber === 1}
//                   onClick={() => { setPageNumber(p => p - 1); window.scrollTo(0,0); }}
//                   className="p-5 rounded-full border bg-white shadow-sm disabled:opacity-20 hover:bg-gray-50 transition-all"
//                 >
//                    <FaArrowLeft />
//                 </button>
                
//                 <span className="font-black text-xl">Page {salonsData.page} of {salonsData.pages}</span>

//                 <button 
//                   disabled={pageNumber === salonsData.pages}
//                   onClick={() => { setPageNumber(p => p + 1); window.scrollTo(0,0); }}
//                   className="p-5 rounded-full border bg-white shadow-sm disabled:opacity-20 hover:bg-gray-50 transition-all"
//                 >
//                    <FaArrowRight />
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SalonsPage;



////////version 2 with location-based search (BOSS REQUIREMENT)////////




// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useLocation, useSearchParams } from "react-router-dom"; // ← Added useSearchParams
// import { FaFilter, FaSearch, FaSpinner, FaArrowLeft, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
// import { useSalons } from "../api/swr";
// import SalonCard from "../components/SalonCard";

// const SalonsPage = () => {
//   const { t } = useTranslation();
//   const [searchParams, setSearchParams] = useSearchParams(); // ← New

//   // Get values from URL search params
//   const keyword = searchParams.get("keyword") || "";
//   const address = searchParams.get("address") || "";
//   const city = searchParams.get("city") || "";

//   const [pageNumber, setPageNumber] = useState(1);
//   const [salons, setSalons] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);

//   // Search input states
//   const [searchKeyword, setSearchKeyword] = useState(keyword);
//   const [searchAddress, setSearchAddress] = useState(address);
//   const [searchCity, setSearchCity] = useState(city);

//   const { data: salonsData, isLoading: loading, error, mutate } = useSalons(
//     pageNumber, 
//     keyword, 
//     address,     // ← Passed to hook
//     city         // ← Passed to hook
//   );

//   useEffect(() => {
//     if (salonsData?.salons) {
//       setSalons(salonsData.salons);
//     }
//   }, [salonsData]);

//   // Reset page to 1 when search changes
//   useEffect(() => {
//     setPageNumber(1);
//   }, [keyword, address, city]);

//   // Handle search submission
//   const handleSearch = (e) => {
//     e.preventDefault();
    
//     const params = new URLSearchParams();
    
//     if (searchKeyword.trim()) params.set("keyword", searchKeyword.trim());
//     if (searchAddress.trim()) params.set("address", searchAddress.trim());
//     if (searchCity.trim()) params.set("city", searchCity.trim());

//     setSearchParams(params);
//   };

//   return (
//     <div className="bg-white min-h-screen pb-20">
//       <section className="bg-[#1D1D1F] text-white py-16 px-6">
//         <div className="container mx-auto">
//           <h1 className="text-5xl font-black tracking-tighter mb-4">{t("salons.header")}</h1>
//           <p className="text-gray-400 text-lg">{t("salons.discover", { count: salonsData?.totalSalons || 0 })}</p>
//         </div>
//       </section>

//       {/* Enhanced Search Bar + Filters */}
//       <section className="bg-white border-b sticky top-0 z-40 py-4 px-6 shadow-sm">
//         <div className="container mx-auto">
//           <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
//             {/* Main Keyword Search */}
//             <div className="flex-1 relative">
//               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
//               <input 
//                 type="text" 
//                 value={searchKeyword}
//                 onChange={(e) => setSearchKeyword(e.target.value)}
//                 placeholder={"search salons by name, description and city"} 
//                 className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-purple outline-none font-medium" 
//               />
//             </div>


//             {/* <div className="flex-1 relative md:max-w-xs">
//               <input 
//                 type="text" 
//                 value={searchAddress}
//                 onChange={(e) => setSearchAddress(e.target.value)}
//                 placeholder="Search by address" 
//                 className="w-full pl-4 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-purple outline-none font-medium" 
//               />
//             </div>


//             <div className="flex-1 relative md:max-w-xs">
//               <input 
//                 type="text" 
//                 value={searchCity}
//                 onChange={(e) => setSearchCity(e.target.value)}
//                 placeholder="Search by city" 
//                 className="w-full pl-4 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-purple outline-none font-medium" 
//               />
//             </div> */}

//             {/* Search Button */}
//             <button 
//               type="submit"
//               className="px-8 bg-primary-purple hover:bg-purple-700 text-white font-bold rounded-2xl transition-all active:scale-95"
//             >
//               Search
//             </button>

//             <button 
//               type="button"
//               onClick={() => setShowFilters(!showFilters)} 
//               className="px-6 bg-gray-50 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap"
//             >
//               <FaFilter /> {t("salons.filters")}
//             </button>
//           </form>
//         </div>
//       </section>

//       <div className="container mx-auto px-6 py-12">
//         {loading ? (
//           <div className="text-center py-20"><FaSpinner className="animate-spin text-5xl text-primary-purple mx-auto" /></div>
//         ) : error ? (
//           <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100 max-w-xl mx-auto p-10">
//             <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
//             <h2 className="text-2xl font-black text-red-700 leading-tight">Server Connection Error</h2>
//             <p className="text-red-600 mt-2">The system is taking a bit long to respond. This usually happens when the backend is waking up.</p>
//             <button onClick={() => mutate()} className="mt-8 bg-red-600 text-white px-10 py-3 rounded-full font-black shadow-lg">Retry Connection</button>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//               {salons.map((salon) => <SalonCard key={salon._id} salon={salon} />)}
//             </div>

//             {/* Pagination - Unchanged */}
//             {salonsData?.pages > 1 && (
//               <div className="mt-20 flex justify-center items-center gap-6">
//                 <button 
//                   disabled={pageNumber === 1}
//                   onClick={() => { setPageNumber(p => p - 1); window.scrollTo(0,0); }}
//                   className="p-5 rounded-full border bg-white shadow-sm disabled:opacity-20 hover:bg-gray-50 transition-all"
//                 >
//                    <FaArrowLeft />
//                 </button>
                
//                 <span className="font-black text-xl">Page {salonsData.page} of {salonsData.pages}</span>

//                 <button 
//                   disabled={pageNumber === salonsData.pages}
//                   onClick={() => { setPageNumber(p => p + 1); window.scrollTo(0,0); }}
//                   className="p-5 rounded-full border bg-white shadow-sm disabled:opacity-20 hover:bg-gray-50 transition-all"
//                 >
//                    <FaArrowRight />
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SalonsPage

import { useEffect, useState, useCallback } from "react";
import axios from "axios"; 
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { 
  FaFilter, 
  FaSearch, 
  FaSpinner, 
  FaArrowLeft, 
  FaArrowRight, 
  FaExclamationTriangle, 
  FaLocationArrow 
} from "react-icons/fa";
import { useSalons } from "../api/swr";
import SalonCard from "../components/SalonCard";

const SalonsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [userCountry, setUserCountry] = useState("");
  const [isDetecting, setIsDetecting] = useState(true);

  // Extract all params
  const keyword = searchParams.get("keyword") || "";
  const lat = searchParams.get("lat") || "";
  const lng = searchParams.get("lng") || "";
  const radius = searchParams.get("radius") || "30";

  const [pageNumber, setPageNumber] = useState(1);
  const [salons, setSalons] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(keyword);

  // Location states
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showLocationNotice, setShowLocationNotice] = useState(false);

  // 🚀 FIXED: SWR only fetches when 'userCountry' has been detected
  // This prevents the page from accidentally loading a global mixture first
  const shouldFetch = !isDetecting || (lat && lng);
  const countryForHook = shouldFetch ? userCountry : null;

  const { data: salonsData, isLoading: loading, error, mutate } = useSalons(
    pageNumber,
    keyword,
    "",
    "",
    countryForHook,
    lat,
    lng,
    radius
  );

  // Detect Country on mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const { data } = await axios.get("https://ipapi.co/json/");
        if (data.country_name) {
          setUserCountry(data.country_name);
        }
      } catch (err) {
        console.error("SalonsPage: Country detection failed");
        setUserCountry("International"); // Fallback
      } finally {
        setIsDetecting(false);
      }
    };
    detectLocation();
  }, []);

  useEffect(() => {
    if (salonsData?.salons) {
      setSalons(salonsData.salons);
    }
  }, [salonsData]);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const params = new URLSearchParams();
        params.set("lat", latitude.toFixed(6));
        params.set("lng", longitude.toFixed(6));
        params.set("radius", "30");

        setSearchParams(params);
        setShowLocationNotice(true);
        setIsGettingLocation(false);
      },
      (err) => {
        console.error(err);
        setIsGettingLocation(false);
      }
    );
  }, [setSearchParams]);

  useEffect(() => {
    const hasFilter = keyword || (lat && lng);
    if (!hasFilter) {
      getUserLocation();
    } else if (lat && lng) {
      setShowLocationNotice(true);
    }
  }, [keyword, lat, lng, getUserLocation]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchInput.trim()) {
      params.set("keyword", searchInput.trim());
    }
    if (lat && lng) {
      params.set("lat", lat);
      params.set("lng", lng);
      params.set("radius", radius);
    }

    setSearchParams(params);
    setShowLocationNotice(!!(lat && lng));   
  };

  useEffect(() => {
    setPageNumber(1);
  }, [keyword, lat, lng, userCountry]);

  // Show loading spinner if still detecting IP OR if the SWR is fetching
  const showPageLoading = isDetecting || (loading && salons.length === 0);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* UI indicator for localized results */}
      {!isDetecting && userCountry && userCountry !== "International" && (
        <div className="bg-emerald-600 text-white py-2 text-center text-[10px] font-black uppercase tracking-widest">
           📍 {t("salons.localizedNotice") || "Showing results for"} {userCountry}
        </div>
      )}

      <section className="bg-[#1D1D1F] text-white py-16 px-6">
        <div className="container mx-auto">
          <h1 className="text-5xl font-black tracking-tighter mb-4">{t("salons.header")}</h1>
          <p className="text-gray-400 text-lg font-medium">
            {lat && lng 
              ? "Showing salons near your current location" 
              : `Discover verified beauty salons in ${userCountry || 'your area'}`}
          </p>
        </div>
      </section>

      <section className="bg-white border-b sticky top-0 z-40 py-4 px-6 shadow-sm">
        <div className="container mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input 
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("salons.searchPlaceholder") || "Search by salon name or city"}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-purple outline-none font-medium"
              />
            </div>

            <button 
              type="button"
              onClick={getUserLocation}
              disabled={isGettingLocation}
              className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center gap-2 transition-all disabled:opacity-70 h-14 md:h-auto"
            >
              {isGettingLocation ? <FaSpinner className="animate-spin" /> : <FaLocationArrow />}
              Near Me
            </button>

            <button 
              type="button"
              onClick={() => setShowFilters(!showFilters)} 
              className="px-6 bg-gray-50 rounded-2xl font-bold flex items-center gap-2 h-14 md:h-auto"
            >
              <FaFilter /> {t("salons.filters")}
            </button>

            <button 
              type="submit"
              className="px-8 bg-primary-purple hover:bg-purple-700 text-white font-bold rounded-2xl transition-all h-14 md:h-auto"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {showLocationNotice && lat && lng && (
        <div className="bg-emerald-50 border-b border-emerald-100 py-3 px-6">
          <div className="container mx-auto flex items-center gap-3 text-emerald-700 text-sm">
            <FaLocationArrow />
            <p>Showing salons within 30km of your current location.</p>
            <button 
              onClick={() => setShowLocationNotice(false)}
              className="ml-auto underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-12">
        {showPageLoading ? (
          <div className="text-center py-20">
            <FaSpinner className="animate-spin text-5xl text-primary-purple mx-auto" />
            <p className="mt-4 text-gray-400 font-bold uppercase text-xs tracking-widest">{t("salons.detecting") || "Localizing Directory..."}</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100 max-w-xl mx-auto p-10">
            <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-black text-red-700">Connection Error</h2>
            <button onClick={() => mutate()} className="mt-8 bg-red-600 text-white px-10 py-3 rounded-full font-black shadow-lg">
              Retry
            </button>
          </div>
        ) : salons.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="text-xl text-gray-500 font-bold italic">No salons found in {userCountry || "this area"} yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {salons.map((salon) => (
                <SalonCard 
                  key={salon._id} 
                  salon={salon} 
                />
              ))}
            </div>

            {salonsData?.pages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-6">
                <button 
                  disabled={pageNumber === 1}
                  onClick={() => { setPageNumber(p => p - 1); window.scrollTo(0,0); }}
                  className="p-5 rounded-full border bg-white shadow-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  <FaArrowLeft />
                </button>
                <span className="font-black text-xl">Page {salonsData.page} of {salonsData.pages}</span>
                <button 
                  disabled={pageNumber === salonsData.pages}
                  onClick={() => { setPageNumber(p => p + 1); window.scrollTo(0,0); }}
                  className="p-5 rounded-full border bg-white shadow-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  <FaArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SalonsPage;