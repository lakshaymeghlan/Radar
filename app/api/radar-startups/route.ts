import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const startups = await db.collection("radar_startups")
      .find({ status: { $in: ["published", "verified"] } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ startups });
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
    const { name, tagline, description, link, tags, logo } = await request.json();
    
    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
    }

    const db = await getDb();
    const startup = {
      name,
      tagline,
      description,
      link,
      tags: tags || [],
      logo,
      founderId: new ObjectId(session.user.id),
      founderName: session.user.name,
      status: link ? "verified" : "published",
      upvotes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("radar_startups").insertOne(startup);

    return NextResponse.json({ 
      message: "Startup listed successfully!", 
      id: result.insertedId 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
