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
    const notifications = await db.collection("notifications")
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    const unreadCount = await db.collection("notifications").countDocuments({
      userId: new ObjectId(session.user.id),
      isRead: false
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { notificationId } = await request.json();
    const db = await getDb();

    await db.collection("notifications").updateOne(
      { _id: new ObjectId(notificationId), userId: new ObjectId(session.user.id) },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    await db.collection("notifications").updateMany(
      { userId: new ObjectId(session.user.id), isRead: false },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
