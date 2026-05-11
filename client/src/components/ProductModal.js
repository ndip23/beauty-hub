import React, { useEffect, useState } from "react";
import { FaTimes, FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { uploadToCloudinary } from "../utils/upload";
import { toast } from "react-toastify";
import Button from "./Button";

const ProductModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: 0,
    category: "haircare",
    photos: [],
    featured: false,
    isAvailable: true,
  });

  const [ setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setProduct({
        ...initialData,
        price: initialData.price || "",
        stock: initialData.stock || 0,
      });
    } else {
      setProduct({
        name: "",
        description: "",
        price: "",
        stock: 0,
        category: "haircare",
        photos: [],
        featured: false,
        isAvailable: true,
      });
    }
  }, [initialData]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    const newImages = [];

    try {
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        if (url) newImages.push(url);
      }

      setProduct((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), ...newImages],
      }));
      toast.success(`${newImages.length} image(s) uploaded`);
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const removeImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            {initialData ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-2xl">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label>Product Name</label>
            <input
              type="text"
              required
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              rows={3}
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Price</label>
              <input
                type="number"
                required
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                className="w-full p-3 border rounded-xl"
              />
            </div>
            <div>
              <label>Stock Quantity</label>
              <input
                type="number"
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label>Category</label>
            <select
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              className="w-full p-3 border rounded-xl"
            >
              <option value="haircare">Hair Care</option>
              <option value="skincare">Skin Care</option>
              <option value="tools">Tools & Equipment</option>
              <option value="makeup">Makeup</option>
              <option value="accessories">Accessories</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Gallery */}
          <div>
            <label className="block mb-2">Product Images</label>
            <div className="grid grid-cols-4 gap-3">
              {product.photos.map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img} alt="" className="w-full h-24 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>

            <label className="mt-4 cursor-pointer border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center block">
              <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
              <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-2" />
              <p>Click to upload multiple photos</p>
            </label>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={product.featured}
                onChange={(e) => setProduct({ ...product, featured: e.target.checked })}
              />
              Mark as Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={product.isAvailable}
                onChange={(e) => setProduct({ ...product, isAvailable: e.target.checked })}
              />
              Available for sale
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 p-3 text-white">
              {initialData ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;