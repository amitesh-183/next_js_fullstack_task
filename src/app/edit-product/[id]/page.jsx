"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ImageUploader from "@/components/ImageUploader";
import axios from "axios";
import toast from "react-hot-toast";

const EditProduct = ({ params }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      fetchProduct();
    }
  }, [status, params.id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${params.id}`);
      const product = response.data;
      if (product) {
        setTitle(product.name);
        setDescription(product.description);
        setPrice(product.price.toString());
        setImage(product.imageUrl);
      } else {
        toast.error("Failed to fetch product details");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to fetch product details");
    }
  };

  const handleImageChange = (newImageUrl) => {
    setImage(newImageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== "authenticated") {
      toast.error("You must be logged in to submit changes for review");
      return;
    }

    try {
      const reviewData = {
        productId: params.id,
        // userId: session.user.id,
        // author: session.user.id,
        changes: {
          name: title,
          description,
          price: parseFloat(price),
          imageUrl: image,
        },
      };

      console.log(reviewData);

      const response = await axios.post(`/api/review`, reviewData);

      if (response.status === 201) {
        toast.success("Product changes submitted for review");
        router.push("/profile/my-submissions");
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting changes for review:", error);
      toast.error(
        error.response?.data?.error ||
          "An error occurred while submitting changes"
      );
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUploader currentImage={image} onImageChange={handleImageChange} />
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Product Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product Title"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Product Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product Description"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Changes for Approval
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
