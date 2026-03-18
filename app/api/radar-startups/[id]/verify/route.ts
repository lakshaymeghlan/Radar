import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const db = await getDb();
    
    // Check ownership
    const startup = await db.collection("radar_startups").findOne({ 
      _id: new ObjectId(id),
      founderId: new ObjectId(session.user.id)
    });

    if (!startup) {
      return NextResponse.json({ error: "Startup not found or unauthorized" }, { status: 404 });
    }

    // In a real startup, we would set this to 'pending' and notify admins.
    // For this build, we'll mark as verified to show the functionality.
    await db.collection("radar_startups").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'verified', verifiedAt: new Date() } }
    );

    // Create notification
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: session.user.id,
      message: `Your startup "${startup.name}" has been verified!`,
      type: "system",
      link: "/profile",
    });

    return NextResponse.json({ success: true, status: 'verified' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
