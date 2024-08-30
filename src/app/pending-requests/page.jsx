"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PendingRequests = () => {
  const [reviews, setReviews] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role === "admin") {
        fetchReviews();
      } else {
        router.push("/dashboard/admin"); // Redirect to an unauthorized page or dashboard
      }
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
          status: "pending",
        },
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Requests</h1>
      <ul>
        {reviews.map((review) => (
          <li key={review._id} className="mb-4 p-4 border rounded">
            <Link href={`/pending-requests/${review._id}`}>
              <p>Product ID: {review.productId}</p>
              <p>Submitted by: {review.userId}</p>
              <p>Submitted on: {new Date(review.createdAt).toLocaleString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingRequests;
