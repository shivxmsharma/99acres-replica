import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const property = await Property.findByIdAndUpdate(
      id, 
      { isVerified: true }, 
      { new: true }
    );

    if (!property) {
      return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
    }

    // Update Algolia index status
    try {
      const { syncPropertiesToAlgolia } = await import("@/lib/algolia");
      await syncPropertiesToAlgolia(property);
    } catch (algoliaErr) {
      console.error("Failed to sync verified property to Algolia:", algoliaErr);
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
