import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { targetIds } = await request.json();

    if (!targetIds || !Array.isArray(targetIds)) {
      return NextResponse.json({ error: "Invalid targetIds" }, { status: 400 });
    }

    const db = await getDb();
    
    // Aggregate counts for all provided targetIds
    const counts = await db.collection("comments").aggregate([
      { $match: { targetId: { $in: targetIds } } },
      { $group: { _id: "$targetId", count: { $sum: 1 } } }
    ]).toArray();

    // Map to a more convenient format: { targetId: count }
    const countsMap = counts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(countsMap);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
