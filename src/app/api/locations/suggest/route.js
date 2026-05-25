import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Property from "@/models/Property";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    await dbConnect();

    // Find unique cities and areas matching the query
    // In a real app, we'd have a dedicated Location collection
    // For now, we extract from the Property data
    const properties = await Property.find({
      $or: [
        { "address.city": { $regex: q, $options: "i" } },
        { "address.locality": { $regex: q, $options: "i" } }
      ]
    }).limit(20).select("address");

    // Extract unique cities and areas
    const suggestions = new Set();
    properties.forEach(p => {
      if (p.address?.city && p.address.city.toLowerCase().includes(q.toLowerCase())) {
        suggestions.add(`${p.address.city} (City)`);
      }
      if (p.address?.locality && p.address.locality.toLowerCase().includes(q.toLowerCase())) {
        suggestions.add(`${p.address.locality}, ${p.address.city}`);
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: Array.from(suggestions).slice(0, 10) 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
