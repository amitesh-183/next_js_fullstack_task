"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PendingRequestDetails = () => {
  const router = useRouter();
  const { request_id } = router.query;
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `/api/review/pending-requests/${request_id}`
        );
        setReview(response.data);
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    if (request_id) {
      fetchReview();
    }
  }, [request_id]);

  if (!review) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Request Details</h1>
      <div className="mb-4 p-4 border rounded">
        <p>Product ID: {review.productId}</p>
        <p>Status: {review.status}</p>
        <p>Submitted by: {review.userId}</p>
        <p>Changes: {JSON.stringify(review.changes, null, 2)}</p>
        <p>Submitted on: {new Date(review.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default PendingRequestDetails;
