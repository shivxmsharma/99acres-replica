import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    const review = await Review.create({
      ...body,
      userId: session.user.id
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "You have already reviewed this property" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");

  try {
    await dbConnect();
    const reviews = await Review.find({ propertyId })
      .populate("userId", "name image")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
