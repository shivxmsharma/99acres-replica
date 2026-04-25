import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";
import Property from "@/models/Property";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    const property = await Property.findById(lead.propertyId);
    if (!property || property.owner.email !== session.user.email) {
      return NextResponse.json({ success: false, error: "Unauthorized access to this lead" }, { status: 403 });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    // Verify ownership
    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    const property = await Property.findById(lead.propertyId);
    if (!property || property.owner.email !== session.user.email) {
      return NextResponse.json({ success: false, error: "Unauthorized access to this lead" }, { status: 403 });
    }

    await Lead.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
