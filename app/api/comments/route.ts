import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetId = searchParams.get("targetId");

  if (!targetId) {
    return NextResponse.json({ error: "Missing targetId" }, { status: 400 });
  }

  const db = await getDb();
  const comments = await db
    .collection("comments")
    .find({ targetId })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetId, content } = await request.json();

    if (!targetId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = await getDb();
    const comment = {
      targetId,
      userId: session.user.id,
      userName: session.user.name,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("comments").insertOne(comment);

    return NextResponse.json({ ...comment, _id: result.insertedId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId, content } = await request.json();

    if (!commentId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = await getDb();
    const comment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.collection("comments").updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { content, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = await request.json();

    if (!commentId) {
      return NextResponse.json({ error: "Missing commentId" }, { status: 400 });
    }

    const db = await getDb();
    const comment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.collection("comments").deleteOne({ _id: new ObjectId(commentId) });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
