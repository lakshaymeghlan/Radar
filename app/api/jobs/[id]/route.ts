import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function DELETE(
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
    
    // Check ownership
    const job = await db.collection("jobs").findOne({ 
      _id: new ObjectId(id),
      founderId: new ObjectId(session.user.id)
    });

    if (!job) {
      return NextResponse.json({ error: "Job posting not found or unauthorized" }, { status: 404 });
    }

    // Delete the job
    await db.collection("jobs").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: "Job posting deleted." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
