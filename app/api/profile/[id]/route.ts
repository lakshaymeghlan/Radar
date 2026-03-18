import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Also fetch their startups
    const startups = await db.collection("startups")
      .find({ founderId: new ObjectId(id), status: { $ne: 'pending_approval' } })
      .toArray();

    return NextResponse.json({ 
      user: {
        ...user,
        _id: user._id.toString(),
      },
      startups: startups.map(s => ({ ...s, _id: s._id.toString() }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
