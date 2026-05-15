import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { role } = await req.json();

    if (!["Buyer", "Agent", "Admin"].includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findByIdAndUpdate(
      id, 
      { role }, 
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
