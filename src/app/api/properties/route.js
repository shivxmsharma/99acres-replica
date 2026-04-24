import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Property from "@/models/Property";

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get search params from URL
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const isFeatured = searchParams.get("featured");

    // Build query
    let query = {};
    if (status) query.status = status;
    if (city) query["location.city"] = new RegExp(city, "i");
    if (type) query.type = type;
    if (isFeatured === "true") query.isFeatured = true;

    const properties = await Property.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: properties });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const property = await Property.create(body);
    return NextResponse.json({ success: true, data: property }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
