import { NextResponse } from "next/server";
import { Review } from "@/models/Review";
import connectMongoDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectMongoDB();

    const totalRequests = await Review.countDocuments();
    const approvedRequests = await Review.countDocuments({
      status: "approved",
    });
    const rejectedRequests = await Review.countDocuments({
      status: "rejected",
    });
    const pendingRequests = await Review.countDocuments({ status: "pending" });

    return NextResponse.json({
      totalRequests,
      approvedRequests,
      rejectedRequests,
      pendingRequests,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Error fetching stats" },
      { status: 500 }
    );
  }
}
