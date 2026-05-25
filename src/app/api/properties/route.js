import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get search params from URL
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const status = searchParams.get("status");
    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const isFeatured = searchParams.get("featured");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bhk = searchParams.get("bhk");

    // Build query
    let query = {};
    
    if (q) {
      query.$or = [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
        { "location.city": new RegExp(q, "i") },
        { "location.area": new RegExp(q, "i") },
      ];
    }
    
    if (status && status !== "All") query.status = status;
    if (city && !q) query["location.city"] = new RegExp(city, "i");
    
    // Multi-select Type
    if (type) {
      const types = type.split(",");
      query.type = { $in: types };
    }

    if (isFeatured === "true") query.isFeatured = true;

    // Price Filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Advanced BHK Filtering (Support multi-select like 1,2,3)
    if (bhk) {
      const bhkList = bhk.split(",").map(val => {
        if (val.includes("+")) return { $gte: parseInt(val) };
        return parseInt(val);
      });
      
      const exactMatch = bhkList.filter(v => typeof v === 'number');
      const rangeMatch = bhkList.find(v => typeof v === 'object');
      
      if (exactMatch.length > 0 && rangeMatch) {
        query.$or = [
          { "features.bhk": { $in: exactMatch } },
          { "features.bhk": rangeMatch }
        ];
      } else if (exactMatch.length > 0) {
        query["features.bhk"] = { $in: exactMatch };
      } else if (rangeMatch) {
        query["features.bhk"] = rangeMatch;
      }
    }

    // New Filters
    const constructionStatus = searchParams.get("constructionStatus");
    if (constructionStatus) {
      query.constructionStatus = { $in: constructionStatus.split(",") };
    }

    const furnishing = searchParams.get("furnishing");
    if (furnishing) {
      query["features.furnishing"] = { $in: furnishing.split(",") };
    }

    const ownerRole = searchParams.get("ownerRole");
    if (ownerRole) {
      query["owner.role"] = { $in: ownerRole.split(",") };
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: properties });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    // Attach current user as owner
    const propertyData = {
      ...body,
      owner: {
        name: session.user.name,
        email: session.user.email,
        phone: "+91 XXXXX XXXXX", // Should be from user profile if we had it
        role: session.user.role || "Owner"
      }
    };

    const property = await Property.create(propertyData);

    // Sync newly created property to Algolia in real-time
    try {
      const { syncPropertiesToAlgolia } = await import("@/lib/algolia");
      await syncPropertiesToAlgolia(property);
    } catch (algoliaErr) {
      console.error("Failed to sync new property to Algolia:", algoliaErr);
    }

    return NextResponse.json({ success: true, data: property }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
