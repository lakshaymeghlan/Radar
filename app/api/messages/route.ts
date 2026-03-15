import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

// GET all conversations for the current user
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const userId = session.user.id;

    // Find conversations where the user is either participant
    const conversations = await db.collection("conversations")
      .find({
        participants: userId
      })
      .sort({ updatedAt: -1 })
      .toArray();

    // Enrich with last message and other participant info
    const enrichedConversations = await Promise.all(conversations.map(async (conv) => {
      const otherUserId = conv.participants.find((id: string) => id !== userId);
      const otherUser = await db.collection("users").findOne(
        { _id: new ObjectId(otherUserId) },
        { projection: { name: 1, avatar: 1, tagline: 1 } }
      );
      
      const lastMessage = await db.collection("messages")
        .findOne({ conversationId: conv._id }, { sort: { createdAt: -1 } });

      return {
        ...conv,
        otherUser,
        lastMessage
      };
    }));

    return NextResponse.json({ conversations: enrichedConversations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new message (creates conversation if not exists)
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { recipientId, content, startupId, jobId } = await request.json();
    if (!recipientId || !content) {
      return NextResponse.json({ error: "Recipient and content required" }, { status: 400 });
    }

    const db = await getDb();
    const senderId = session.user.id;

    // Check if conversation already exists between these 2
    let conversation = await db.collection("conversations").findOne({
      participants: { $all: [senderId, recipientId] }
    });

    if (!conversation) {
      const newConv = {
        participants: [senderId, recipientId],
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          startupId: startupId ? new ObjectId(startupId) : null,
          jobId: jobId ? new ObjectId(jobId) : null
        }
      };
      const result = await db.collection("conversations").insertOne(newConv);
      conversation = { ...newConv, _id: result.insertedId };
    } else {
      await db.collection("conversations").updateOne(
        { _id: conversation._id },
        { $set: { updatedAt: new Date() } }
      );
    }

    const message = {
      conversationId: conversation._id,
      senderId,
      recipientId,
      content,
      createdAt: new Date(),
      read: false
    };

    const result = await db.collection("messages").insertOne(message);

    // Create notification for recipient
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: recipientId,
      message: `${session.user.name} sent you a message`,
      type: "new_message",
      link: "/inbox",
    });

    return NextResponse.json({ message: { ...message, _id: result.insertedId } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
