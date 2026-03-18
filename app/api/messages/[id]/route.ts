import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(
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
    
    // Check if user is part of this conversation
    const conversation = await db.collection("conversations").findOne({
      _id: new ObjectId(id),
      participants: session.user.id
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const messages = await db.collection("messages")
      .find({ conversationId: new ObjectId(id) })
      .sort({ createdAt: 1 })
      .toArray();

    // Mark messages as read
    await db.collection("messages").updateMany(
      { 
        conversationId: new ObjectId(id), 
        recipientId: session.user.id,
        read: false 
      },
      { $set: { read: true } }
    );

    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
