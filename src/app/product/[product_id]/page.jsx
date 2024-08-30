"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ImageUploader from "@/components/ImageUploader";

export default function ProductDetailPage({ params }) {
  const { data: session, status } = useSession();
  const [product, setProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "Admin") {
      router.push(
        `/dashboard/${session.user.role.toLowerCase().replace(" ", "-")}`
      );
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${params.product_id}`);
        setProduct(res.data);
        setEditedProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (status === "authenticated" && session?.user.role === "Admin") {
      fetchProduct();
    }
  }, [params.product_id, session, status]);

  const handleChange = (e) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  const handleImageChange = (imageUrl) => {
    setEditedProduct({ ...editedProduct, imageUrl: imageUrl });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/products/${params.product_id}`, editedProduct);
      router.push(
        `/dashboard/${session.user.role.toLowerCase().replace(" ", "-")}`
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session || session.user.role !== "Admin") return <div>Unauthorized</div>;
  if (!product) return <div>Loading product...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="name"
            value={editedProduct.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={editedProduct.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={editedProduct.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <ImageUploader
          currentImage={editedProduct.imageUrl}
          onImageChange={handleImageChange}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 mt-3 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
