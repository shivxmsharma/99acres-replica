import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const stats = {
      totalProperties: await Property.countDocuments(),
      verifiedProperties: await Property.countDocuments({ isVerified: true }),
      pendingProperties: await Property.countDocuments({ isVerified: false }),
      totalUsers: await User.countDocuments(),
      totalAgents: await User.countDocuments({ role: "Agent" }),
      activeLeads: 124, // Mock for now until Leads model is ready
      recentSales: 12,
    };

    // Get recent properties
    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("owner", "name email");

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({ 
      success: true, 
      data: { stats, recentProperties, recentUsers } 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
