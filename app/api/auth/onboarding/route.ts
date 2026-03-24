import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json();

    if (!role || (role !== "builder" && role !== "explorer")) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update the user in DB
    const db = await getDb();
    const userId = new ObjectId((session.user as any).id);
    
    await db.collection("users").updateOne(
      { _id: userId },
      { $set: { role, updatedAt: new Date() } }
    );

    const updatedUser = await db.collection("users").findOne({ _id: userId });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
