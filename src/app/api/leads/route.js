import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Property from "@/models/Property";
import Lead from "@/models/Lead";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    await dbConnect();
    const body = await request.json();
    
    if (!body.propertyId || !body.name || !body.mobile) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Attach sender info if logged in
    const leadData = {
      ...body,
      sender: session ? {
        name: session.user.name,
        email: session.user.email
      } : null
    };

    const lead = await Lead.create(leadData);
    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Find properties owned by this user
    const userProperties = await Property.find({ "owner.email": session.user.email }).select("_id");
    const propertyIds = userProperties.map(p => p._id);

    // Find leads for these properties
    const leads = await Lead.find({ propertyId: { $in: propertyIds } }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
