import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongoDB from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
  // Check if the user is authenticated and has the Admin role
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Connect to MongoDB
  await connectMongoDB();

  // Fetch pending reviews
  const reviews = await Review.find({ status: "pending" })
    .populate("productId", "name")
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .exec();

  // Return the reviews as a JSON response
  return NextResponse.json(reviews);
}
