"use client";

import axios from "axios";

const submitReview = async (productId, changes) => {
  try {
    const response = await axios.post("/api/review", { productId, changes });
    alert(response.data.message);
  } catch (error) {
    console.error("Error submitting review:", error);
    alert("Failed to submit review");
  }
};

const SubmitReviewButton = ({ productId, changes }) => (
  <button
    onClick={() => submitReview(productId, changes)}
    className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    Submit for Review
  </button>
);

export default SubmitReviewButton;
