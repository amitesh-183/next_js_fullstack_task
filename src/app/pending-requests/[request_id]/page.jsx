"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LottieAnimation from "@/components/Loader";

const PendingRequestDetails = ({ params }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [review, setReview] = useState(null);
  const { request_id } = params;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "Admin") {
      router.push(`/dashboard/${session.user.role.toLowerCase()}`);
      return;
    }

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
  }, [request_id, session, status, router]);

  const handleActionClick = (action) => {
    setActionToConfirm(action);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      await axios.put(`/api/review/${request_id}`, { status: actionToConfirm });
      router.push("/pending-requests");
    } catch (error) {
      console.error(`Error ${actionToConfirm}ing review:`, error);
    }
    setShowConfirmation(false);
  };

  if (status === "loading" || !review) {
    return (
      <>
        <LottieAnimation />
      </>
    );
  }

  if (!session || session.user.role !== "Admin") {
    return null;
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

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Request Details</h1>
      <div className="mb-6 p-6 border rounded-lg shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <p>
            <span className="font-semibold">Product ID:</span>{" "}
            {review.productId}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span className={getStatusColor(review.status)}>
              {review.status}
            </span>
          </p>
          <p>
            <span className="font-semibold">Submitted by:</span> {review.userId}
          </p>
          <p>
            <span className="font-semibold">Submitted on:</span>{" "}
            {new Date(review.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-4">
          <p className="font-semibold mb-2">Changes:</p>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(review.changes, null, 2)}
          </pre>
        </div>
      </div>
      {review.status === "pending" && (
        <div className="flex flex-col sm:flex-row sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => handleActionClick("approved")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Accept
          </button>
          <button
            onClick={() => handleActionClick("rejected")}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Reject
          </button>
        </div>
      )}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p>Are you sure you want to {actionToConfirm} this request?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRequestDetails;
