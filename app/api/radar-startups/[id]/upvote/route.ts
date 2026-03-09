import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const db = await getDb();
    
    // Check if already upvoted
    const existingUpvote = await db.collection("upvotes").findOne({
      userId: new ObjectId(session.user.id),
      targetId: new ObjectId(id)
    });

    if (existingUpvote) {
      // Remove upvote
      await db.collection("upvotes").deleteOne({
        userId: new ObjectId(session.user.id),
        targetId: new ObjectId(id)
      });
      
      await db.collection("radar_startups").updateOne(
        { _id: new ObjectId(id) },
        { $inc: { upvotes: -1 } }
      );
      
      return NextResponse.json({ upvoted: false });
    } else {
      // Add upvote
      await db.collection("upvotes").insertOne({
        userId: new ObjectId(session.user.id),
        targetId: new ObjectId(id),
        createdAt: new Date()
      });

      await db.collection("radar_startups").updateOne(
        { _id: new ObjectId(id) },
        { $inc: { upvotes: 1 } }
      );

      // Notify founder
      const startup = await db.collection("radar_startups").findOne({ _id: new ObjectId(id) });
      if (startup && startup.founderId.toString() !== session.user.id) {
        const { createNotification } = await import("@/lib/notifications");
        await createNotification({
          userId: startup.founderId,
          message: `${session.user.name} upvoted your startup "${startup.name}"`,
          type: "startup_voted",
          link: "/",
        });
      }

      return NextResponse.json({ upvoted: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
