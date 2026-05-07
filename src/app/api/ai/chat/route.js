import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req) {
  try {
    await dbConnect();

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const userQuestion = messages[messages.length - 1].content;

    // Optional: Fetch some properties if the user is asking about them.
    let propertyContext = "";
    if (userQuestion.toLowerCase().includes("property") || userQuestion.toLowerCase().includes("buy") || userQuestion.toLowerCase().includes("rent")) {
      const topProperties = await Property.find({ status: "active" }).limit(3).lean();
      if (topProperties.length > 0) {
        propertyContext = "\n\nHere are some top properties currently available:\n" + 
          topProperties.map(p => `- ${p.title} in ${p.address?.locality || p.location?.area}, ${p.address?.city || p.location?.city} for ₹${p.price.toLocaleString('en-IN')}`).join("\n");
      }
    }

    const systemInstruction = `You are the "99acres AI Assistant", a helpful and professional real estate assistant for 99acres-replica. 
Your goal is to help users find properties, understand the market, and answer real estate queries.
Current Region: India (Major cities like Delhi, Mumbai, Bangalore, etc.)
Be concise, professional, and friendly. Use formatting like bullet points to make information easy to read.
If you suggest properties, provide their basic details.
${propertyContext}`;

    const model = getGeminiModel("gemini-1.5-flash");

    // Convert history into Gemini format
    const chat = model.startChat({
      history: messages.slice(0, -1).map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userQuestion + (propertyContext ? "\n\nPlease keep these properties in mind while answering." : ""));
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("AI Assistant API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response. Please try again later." },
      { status: 500 }
    );
  }
}
