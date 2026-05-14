import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Property from "@/models/Property";

export async function POST(request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      propertyId 
    } = await request.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await dbConnect();
      const updatedProperty = await Property.findByIdAndUpdate(
        propertyId, 
        { isFeatured: true },
        { new: true }
      );
      
      // Sync to Algolia
      const { syncPropertiesToAlgolia } = await import("@/lib/algolia");
      await syncPropertiesToAlgolia(updatedProperty);

      return NextResponse.json({ success: true, message: "Payment verified and property boosted!" });
    } else {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
