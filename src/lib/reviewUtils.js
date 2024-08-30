// src/lib/reviewUtils.js
import { Review } from "@/models/Review";

// Fetch pending reviews
export const fetchPendingReviews = async () => {
  try {
    return await Review.find({ status: "pending" })
      .populate("productId")
      .populate("userId")
      .exec();
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    throw new Error("Failed to fetch pending reviews");
  }
};

// Get review by ID
export const fetchReviewById = async (reviewId) => {
  try {
    return await Review.findById(reviewId)
      .populate("productId")
      .populate("userId")
      .exec();
  } catch (error) {
    console.error("Error fetching review by ID:", error);
    throw new Error("Failed to fetch review");
  }
};

// Update review status
export const updateReviewStatus = async (reviewId, status) => {
  try {
    if (!["approved", "rejected"].includes(status)) {
      throw new Error("Invalid status");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }

    review.status = status;
    await review.save();
    return review;
  } catch (error) {
    console.error("Error updating review status:", error);
    throw new Error("Failed to update review status");
  }
};
