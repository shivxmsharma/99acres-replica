import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET property by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const property = await Property.findByIdAndUpdate(
      id, 
      { $inc: { views: 1 } }, 
      { new: true }
    );

    if (!property) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// UPDATE property by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    // Check if property exists and user is owner
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
    }

    if (property.owner?.email !== session.user.email) {
      return NextResponse.json({ success: false, error: "Unauthorized to edit this property" }, { status: 403 });
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    return NextResponse.json({ success: true, data: updatedProperty });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE property by ID
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    // Check if property exists and user is owner
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
    }

    if (property.owner?.email !== session.user.email) {
      return NextResponse.json({ success: false, error: "Unauthorized to delete this property" }, { status: 403 });
    }

    await Property.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
