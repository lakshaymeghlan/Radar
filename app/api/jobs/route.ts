import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startupId = searchParams.get("startupId");

  try {
    const db = await getDb();
    const query = startupId ? { startupId: new ObjectId(startupId) } : {};
    const jobs = await db.collection("jobs")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ jobs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, type, salaryRange, location, startupId } = await request.json();
    
    if (!title || !startupId) {
      return NextResponse.json({ error: "Title and startupId are required" }, { status: 400 });
    }

    const db = await getDb();
    const job = {
      title,
      description,
      type,
      salaryRange,
      location,
      startupId: new ObjectId(startupId),
      founderId: new ObjectId(session.user.id),
      createdAt: new Date(),
    };

    const result = await db.collection("jobs").insertOne(job);

    return NextResponse.json({ 
      message: "Job posted successfully!", 
      id: result.insertedId 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
