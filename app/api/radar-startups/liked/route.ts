import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    
    // Get all upvotes by this user
    const upvotes = await db.collection("upvotes")
      .find({ userId: new ObjectId(session.user.id) })
      .toArray();
    
    const targetIds = upvotes.map((uv: any) => uv.targetId);
    
    if (targetIds.length === 0) {
      return NextResponse.json({ startups: [] });
    }

    // Fetch the actual startup details
    const likedStartups = await db.collection("radar_startups")
      .find({ _id: { $in: targetIds } })
      .toArray();

    return NextResponse.json({ 
      startups: likedStartups.map((s: any) => ({
        ...s,
        isLiked: true
      })) 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
