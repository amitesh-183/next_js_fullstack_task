"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ImageUploader from "@/components/ImageUploader";
import axios from "axios";
import toast from "react-hot-toast";
import { BiChevronLeft } from "react-icons/bi";
import LottieAnimation from "@/components/Loader";
import Link from "next/link";

const EditProduct = ({ params }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProduct();
    }
  }, [status, params.id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${params.product_id}`);
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

  const handleEditing = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== "authenticated") {
      toast.error("You must be logged in to submit changes");
      return;
    }

    try {
      const productData = {
        name: title,
        description,
        price: parseFloat(price),
        imageUrl: image,
      };

      if (session.user.role === "Admin") {
        // Admin: directly update the product
        const response = await axios.put(
          `/api/products/${params.product_id}`,
          productData
        );
        if (response.status === 200) {
          toast.success("Product updated successfully");
          router.push("/products");
          router.push(`/dashboard/${session.user.role}`);
          setIsEditing(false);
        } else {
          throw new Error("Failed to update product");
        }
      } else {
        // Team Member: submit changes for review
        const reviewData = {
          productId: params.product_id,
          changes: productData,
        };
        const response = await axios.post(`/api/review`, reviewData);
        if (response.status === 201) {
          toast.success("Product changes submitted for review");
          router.push("/profile/my-submissions");
          setIsEditing(false);
        } else {
          throw new Error("Failed to submit review");
        }
      }
    } catch (error) {
      console.error("Error submitting changes:", error);
      toast.error(
        error.response?.data?.error ||
          "An error occurred while submitting changes"
      );
    }
  };

  if (status === "loading") {
    return (
      <>
        <LottieAnimation />
      </>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex gap-1">
        <Link href={`/dashboard/${session.user.role.toLowerCase()}`}>
          <BiChevronLeft
            size={32}
            className="hover:text-pink-500 hover:-translate-x-1 duration-300"
          />
        </Link>
        <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-6 items-center md:px-10 px-4">
          <ImageUploader
            currentImage={image}
            onImageChange={handleImageChange}
          />
          {!isEditing ? (
            <div className="w-full">
              <div className="pb-2">
                <h1 className="block pb-2 text-2xl font-semibold text-black ">
                  {title}
                </h1>
              </div>
              <div className="pb-2">
                <p className="block pb-2 text-sm font-medium text-gray-700">
                  {description}
                </p>
              </div>
              <div className="pb-2">
                <b className="block pb-2 text-sm font-medium text-gray-700">
                  ₹{price}
                </b>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="pb-2">
                <label className="block pb-2 text-sm font-medium text-gray-700">
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
              <div className="pb-2">
                <label className="block pb-2 text-sm font-medium text-gray-700">
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
              <div className="pb-2">
                <label className="block pb-2 text-sm font-medium text-gray-700">
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
            </div>
          )}
        </div>
        <div className="flex justify-center">
          {!isEditing ? (
            <div
              className="px-5 py-2 bg-pink-500 text-white rounded cursor-pointer hover:bg-pink-600"
              onClick={handleEditing}
            >
              {session.user.role === "Admin"
                ? "Edit Product"
                : "Edit Product for Approval"}
            </div>
          ) : (
            <button
              type="submit"
              className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {session.user.role === "Admin"
                ? "Update Product"
                : "Submit Changes for Approval"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
