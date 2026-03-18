import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession, login } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json();

    if (!role || (role !== "builder" && role !== "explorer")) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { role, updatedAt: new Date() } }
    );

    // Update the session with the new role
    const updatedUser = { 
      ...session.user, 
      role 
    };
    await login(updatedUser);

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
