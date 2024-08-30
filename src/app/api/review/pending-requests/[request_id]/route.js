import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongoDB from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectMongoDB();

    const review = await Review.findById(params.request_id).exec();

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      { error: "Something Went Wrong", error },
      { status: 500 }
    );
  }
}
