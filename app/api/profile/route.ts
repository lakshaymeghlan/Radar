import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const user = await db.collection("users").findOne({ _id: new ObjectId((session.user as any).id) });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Ensure image is mapped to avatar for easier UI consumption
  const safeUser = {
    ...user,
    avatar: user.image || user.avatar,
    // Sensitive data removal
    password: undefined
  };

  return NextResponse.json({ user: safeUser });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { 
      name, bio, tagline, avatar, location, socials, 
      achievements, status, links, projects, education, identityTags 
    } = await request.json();
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
          achievements,
          status,
          links,
          projects,
          education,
          identityTags,
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
