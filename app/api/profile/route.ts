import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Remove sensitive data
  const { password, ...safeUser } = user;

  return NextResponse.json({ user: safeUser });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, bio, tagline, avatar, location, socials } = await request.json();
    const db = await getDb();

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          name,
          bio,
          tagline,
          avatar,
          location,
          socials,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
