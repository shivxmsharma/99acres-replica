import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all";

    await dbConnect();

    let query = { status: "active" };
    if (filter === "pending") query.isVerified = false;
    if (filter === "verified") query.isVerified = true;

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .populate("owner", "name email");

    return NextResponse.json({ success: true, data: properties });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
