"use client";

import React, { useState, useRef, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { storage, ref, uploadBytes, getDownloadURL } from "@/lib/firebase";
import { getAuth, signInAnonymously } from "firebase/auth";

const ImageUploader = ({ currentImage, onImageChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setShowModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = useCallback((image, crop) => {
    return new Promise((resolve, reject) => {
      if (!image || !crop) {
        reject(new Error("Image or crop is missing"));
        return;
      }

      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Unable to get 2D context"));
        return;
      }

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/jpeg");
    });
  }, []);

  const handleImageUpload = async () => {
    if (!completedCrop || !imageRef.current) {
      console.error("Crop not complete or image reference is missing");
      return;
    }

    try {
      // Ensure user is authenticated (anonymously)
      const auth = getAuth();
      await signInAnonymously(auth);

      // Wait for the image to load completely
      await new Promise((resolve) => {
        if (imageRef.current.complete) resolve();
        else imageRef.current.onload = () => resolve();
      });

      const croppedImageBlob = await getCroppedImg(
        imageRef.current,
        completedCrop
      );
      const storageRef = ref(storage, `images/${Date.now()}`);
      await uploadBytes(storageRef, croppedImageBlob);
      const downloadURL = await getDownloadURL(storageRef);
      onImageChange(downloadURL);
      setShowModal(false);
      setError(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
    }
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Product Image
      </label>
      <div onClick={handleImageClick} className="cursor-pointer">
        {currentImage ? (
          <img
            src={currentImage}
            alt="Current"
            className="w-[320px] h-60 object-cover rounded"
          />
        ) : (
          <div className="w-60 h-60 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
            No Image
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      {showModal && image && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white grid place-items-center p-4 rounded max-w-md w-full">
            <ReactCrop
              src={image}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img
                src={image}
                className="h-[400px]"
                alt="Crop"
                ref={imageRef}
                onLoad={() => {
                  // Force ReactCrop to update when the image loads
                  const newCrop = { ...crop };
                  setCrop(newCrop);
                }}
              />
            </ReactCrop>
            <div className="mt-4 flex justify-between w-full">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <div
                onClick={handleImageUpload}
                className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded"
              >
                Save
              </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
