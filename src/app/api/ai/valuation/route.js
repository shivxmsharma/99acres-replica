import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { location, size, propertyType, bedrooms, condition } = body;

    if (!location || !size) {
      return NextResponse.json({ error: "Location and size are required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert real estate appraiser in India. 
    Estimate the current market valuation based on these details:
    - Location: ${location}
    - Size: ${size} sq.ft
    - Property Type: ${propertyType}
    - Bedrooms: ${bedrooms}
    - Condition: ${condition}
    
    Respond ONLY with a valid JSON object. Do not include markdown code blocks. Just return the raw JSON object exactly with the following keys:
    {
      "estimatedRange": "e.g. ₹1.2 Cr - ₹1.5 Cr",
      "averageRatePerSqFt": "e.g. ₹8,500/sq.ft",
      "rentalYieldEstimate": "e.g. 3.5% - 4.2%",
      "marketTrendSummary": "A brief 2-sentence summary of the market trend in this location",
      "confidence": "Low | Medium | High"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Cleanup JSON
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanedText);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Valuation Error:", error);
    return NextResponse.json({ error: "Failed to generate valuation. Please try again." }, { status: 500 });
  }
}
