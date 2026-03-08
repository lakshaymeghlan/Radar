import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const db = await getDb();
    
    // Check ownership
    const startup = await db.collection("radar_startups").findOne({ 
      _id: new ObjectId(id),
      founderId: new ObjectId(session.user.id)
    });

    if (!startup) {
      return NextResponse.json({ error: "Startup not found or unauthorized" }, { status: 404 });
    }

    // Delete the startup
    await db.collection("radar_startups").deleteOne({ _id: new ObjectId(id) });
    
    // Also delete associated jobs
    await db.collection("jobs").deleteMany({ startupId: new ObjectId(id) });

    return NextResponse.json({ success: true, message: "Startup and associated jobs deleted." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
