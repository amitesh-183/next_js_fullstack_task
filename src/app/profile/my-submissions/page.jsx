"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const MySubmissions = () => {
  const [reviews, setReviews] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      fetchReviews();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("/api/review", {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        params: {
          userId: session.user.id,
        },
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        My Submissions
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div className="relative h-48 w-full">
              <Image
                src={review.changes.imageUrl || "/placeholder-image.jpg"}
                alt={review.changes.name}
                layout="fill"
                objectFit="cover"
                className="transition-opacity duration-300 hover:opacity-75"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {review.changes.name}
              </h2>
              <div className="flex items-center mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    review.status
                  )}`}
                >
                  {review.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Submitted on: {new Date(review.createdAt).toLocaleString()}
              </p>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Changes Requested:
                </h3>
                <ul className="list-none text-sm text-gray-600">
                  <li>
                    <span className="font-medium">Title:</span>{" "}
                    {review.changes.name}
                  </li>
                  <li>
                    <span className="font-medium">Description:</span>{" "}
                    {review.changes.description}
                  </li>
                  <li>
                    <span className="font-medium">Price:</span> $
                    {review.changes.price}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySubmissions;
