import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTrash, FaEdit, FaShareAlt, FaStoreAlt, FaSpinner } from "react-icons/fa";
import { useMySalon } from "../api/swr";
import { addProduct, updateProduct, deleteProduct } from "../api";
import { toast } from "react-toastify";
import Button from "../components/Button";
import ProductModal from "../components/ProductModal";
import { useNavigate } from "react-router-dom";

const SalonProductsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: salonData, isLoading, mutate } = useMySalon();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);   // ← Fixed: Added this state

  const handleFormSubmit = async (productData) => {
    if (!salonData?._id) return toast.error("Create your salon profile first.");

    const payload = {
      ...productData,
      currency: salonData.currency || "XAF",
    };

    try {
      if (editingProduct) {
        await updateProduct(salonData._id, editingProduct._id, payload);
        toast.success(t("salonproducts.updateSuccess") || "Product updated successfully");
      } else {
        await addProduct(salonData._id, payload);
        toast.success(t("salonproducts.addSuccess") || "Product added successfully");
      }
      mutate();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm(t("salonproducts.confirmDelete") || "Are you sure you want to delete this product?")) 
      return;

    setDeletingId(productId);
    try {
      await deleteProduct(salonData._id, productId);
      mutate();
      toast.success(t("salonproducts.deleteSuccess") || "Product deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const copyShareLink = () => {
    if (!salonData?.slug) return toast.error("Slug not available");
    const shareLink = `${window.location.origin}/shop/${salonData.slug}`;
    navigator.clipboard.writeText(shareLink);
    toast.success("✅ Shareable link copied!");
  };

  if (isLoading) return <div className="text-center py-20">Loading your products...</div>;

  if (!salonData) {
    return (
      <div className="text-center py-20">
        <h2>{t("salonprofile.createTitle")}</h2>
        <p>{t("salonprofile.basicInfoDesc")}</p>
        <Button onClick={() => navigate("/salon-owner/profile")}>
          Create Salon Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{salonData.name}</h1>
          {/* <p className="text-gray-600">{salonData.name}</p> */}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={copyShareLink}
            className="flex items-center gap-2"
            variant="outline"
          >
            <FaShareAlt /> Share Shop
          </Button>

          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-primary-purple text-white"
          >
            <FaPlus /> {t("salonproducts.addButton") || "Add Product"}
          </Button>
        </div>
      </div>

      {/* Shareable Link */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8 flex items-center justify-between">
        <div>
          <p className="font-medium text-green-800">Your Public Shop Link</p>
          <p className="text-sm text-green-600 break-all">
            {window.location.origin}/shop/{salonData.slug}
          </p>
        </div>
        <Button onClick={copyShareLink} variant="outline" size="sm">
          Copy Link
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Category</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salonData.products?.length > 0 ? (
              salonData.products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {product.photos?.[0] && (
                        <img
                          src={product.photos[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.featured && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium">
                    {product.price} {product.currency}
                  </td>
                  <td className="p-4">
                    <span className={`${product.stock < 5 ? "text-red-600" : ""}`}>
                      {product.stock ?? 0} in stock
                    </span>
                  </td>
                  <td className="p-4 capitalize">{product.category || "Other"}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deletingId === product._id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded ml-2 disabled:opacity-50"
                    >
                      {deletingId === product._id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-16">
                  <FaStoreAlt className="mx-auto text-5xl text-gray-300 mb-4" />
                  <p className="text-xl text-gray-500">No products yet</p>
                  <p className="text-gray-400 mt-2">Add your first product to start selling</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
      />
    </div>
  );
};

export default SalonProductsPage;