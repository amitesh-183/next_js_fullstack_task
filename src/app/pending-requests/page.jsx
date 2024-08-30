"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import LottieAnimation from "@/components/Loader";
import Link from "next/link";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("/api/review");
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    if (status !== "loading" && session) {
      fetchReviews();
    }
  }, [session, status]);

  if (loading) {
    return <LottieAnimation />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  const ReviewCard = ({ review }) => (
    <div
      className={`border rounded-lg p-4 shadow-sm transition-shadow duration-200 ${
        review.status === "rejected"
          ? "opacity-50 bg-gray-100"
          : review.status === "pending"
          ? "hover:shadow-md cursor-pointer"
          : ""
      }`}
    >
      <p>
        <strong>Product ID:</strong> {review.productId}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span className={getStatusColor(review.status)}>{review.status}</span>
      </p>
      <p>
        <strong>Submitted by:</strong> {review.userId}
      </p>
      <p>
        <strong>Submitted on:</strong>{" "}
        {new Date(review.createdAt).toLocaleString()}
      </p>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">All Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <Link href={`/pending-requests/${review._id}`} key={review._id}>
              <ReviewCard review={review} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
