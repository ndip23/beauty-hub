// Route: /shop/:slug
import React from "react";
import { useParams } from "react-router-dom";
import { useSalonBySlug } from "../api/swr";
import { FaWhatsapp, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaStoreAlt } from "react-icons/fa";
const SalonShopPage = () => {
  const { slug } = useParams();
  const { data: salon, isLoading, error } = useSalonBySlug(slug);
console.log(salon)
  const whatsappMessage = (product) => {
    if (!salon?.phone) {
      toast.error("Phone number not available");
      return;
    }

    const message = `Hello 👋\n\nI want to buy:\n*${product.name}*\nPrice: ${product.price} ${product.currency || "XAF"}\n\nCan you confirm availability?`;

    const cleanPhone = salon.phone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shop...</p>
        </div>
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600">Shop Not Found</h2>
          <p className="text-gray-600 mt-2">This salon shop may not exist or is currently unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-3">{salon.data.name}</h1>
          <p className="text-xl opacity-90 flex items-center justify-center gap-2">
            <FaMapMarkerAlt /> {salon.data.city}, {salon.data.address}
          </p>
          {salon.data.description && (
            <p className="mt-4 max-w-2xl mx-auto text-lg opacity-80">
              {salon.data.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Contact Info Bar */}
        <div className="bg-white rounded-2xl shadow p-4 mb-10 flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-3">
            <FaPhone className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Call or WhatsApp</p>
              <p className="font-medium">{salon.data.phone}</p>
            </div>
          </div>
          <button
            onClick={() => window.open(`https://wa.me/${salon.data.phone.replace(/\D/g, "")}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
          >
            <FaWhatsapp size={22} /> Chat on WhatsApp
          </button>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Products</h2>
          <p className="text-gray-600">Premium beauty and haircare products</p>
        </div>

        {salon.data.products && salon.data.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {salon.data.products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gray-100">
                  {product.photos?.[0] ? (
                    <img
                      src={product.photos[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FaStoreAlt size={60} />
                    </div>
                  )}

                  {product.featured && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                      FEATURED
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="font-semibold text-xl leading-tight mb-2">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-baseline justify-between mb-5">
                    <p className="text-3xl font-bold text-purple-700">
                      {product.price?.toLocaleString() || 0}
                      <span className="text-lg font-normal text-gray-500"> {product.currency || "XAF"}</span>
                    </p>
                    {product.stock !== undefined && (
                      <p className={`text-sm font-medium ${product.stock < 5 ? "text-red-600" : "text-green-600"}`}>
                        {product.stock} left
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => whatsappMessage(product)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-3 transition-all active:scale-95"
                  >
                    <FaWhatsapp size={24} />
                    Order via WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl">
            <FaStoreAlt className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700">No Products Yet</h3>
            <p className="text-gray-500 mt-2">This salon hasn't added any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonShopPage;