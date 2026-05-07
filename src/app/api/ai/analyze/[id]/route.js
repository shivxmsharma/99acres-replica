import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import { getGeminiModel } from "@/lib/gemini";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const property = await Property.findById(id).lean();
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const prompt = `Analyze this real estate property listing and provide a structured JSON response.
Property Details:
Title: ${property.title}
Price: ₹${property.price}
Location: ${property.address?.locality || property.location?.area}, ${property.address?.city || property.location?.city}
Type: ${property.propertyType}
BHK: ${property.details?.bedrooms || property.features?.bhk}
Amenities: ${property.amenities?.join(", ")}
Description: ${property.description}

Provide the analysis in the following JSON format:
{
  "analysis": {
    "overallVerdict": "GOOD_DEAL" | "FAIR" | "NEEDS_CAUTION",
    "priceAssessment": "short text",
    "pros": ["string"],
    "cons": ["string"],
    "redFlags": ["string"],
    "neighborhoodSummary": "short text",
    "buyerTips": "short text"
  }
}
Return ONLY the JSON.`;

    const model = getGeminiModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("AI Analysis API Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze property. Please try again later." },
      { status: 500 }
    );
  }
}
