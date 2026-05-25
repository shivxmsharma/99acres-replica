import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    // Instead of hard delete, we mark as inactive
    const property = await Property.findByIdAndUpdate(
      id, 
      { status: "deleted" }, 
      { new: true }
    );

    if (!property) {
      return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
    }

    // Remove deleted property from Algolia search immediately
    try {
      const { deletePropertyFromAlgolia } = await import("@/lib/algolia");
      await deletePropertyFromAlgolia(id);
    } catch (algoliaErr) {
      console.error("Failed to delete property from Algolia:", algoliaErr);
    }

    return NextResponse.json({ success: true, message: "Property deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
