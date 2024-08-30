// src/app/api/profile/stats/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongoDB from "@/lib/mongodb";
import { Review } from "@/models/Review";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();

    const userId = session.user.id;

    const totalRequests = await Review.countDocuments({ userId });
    const approvedRequests = await Review.countDocuments({
      userId,
      status: "approved",
    });
    const rejectedRequests = await Review.countDocuments({
      userId,
      status: "rejected",
    });

    return NextResponse.json({
      totalRequests,
      approvedRequests,
      rejectedRequests,
    });
  } catch (error) {
    console.error("Error fetching profile stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
