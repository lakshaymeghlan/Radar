import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, resume, projects, vision } = await request.json();

    if (!jobId || !resume || !vision) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDb();
    
    // Check if job exists and get founderId
    const job = await db.collection("jobs").findOne({ _id: new ObjectId(jobId) });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check if already applied
    const existingApplication = await db.collection("applications").findOne({
      jobId: new ObjectId(jobId),
      applicantId: new ObjectId(session.user.id),
    });

    if (existingApplication) {
      return NextResponse.json({ error: "You have already applied for this job" }, { status: 400 });
    }

    const application = {
      jobId: new ObjectId(jobId),
      applicantId: new ObjectId(session.user.id),
      founderId: job.founderId,
      resume,
      projects,
      vision,
      status: "pending",
      createdAt: new Date(),
    };

    await db.collection("applications").insertOne(application);

    return NextResponse.json({ message: "Application submitted successfully!" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'sent' or 'received'

    const db = await getDb();
    
    let query = {};
    if (type === "received") {
      // For Builders: applications for their jobs
      query = { founderId: new ObjectId(session.user.id) };
    } else {
      // For Explorers: applications they sent
      query = { applicantId: new ObjectId(session.user.id) };
    }

    const applications = await db.collection("applications")
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "jobs",
            localField: "jobId",
            foreignField: "_id",
            as: "job"
          }
        },
        { $unwind: "$job" },
        {
          $lookup: {
            from: "users",
            localField: "applicantId",
            foreignField: "_id",
            as: "applicant"
          }
        },
        { $unwind: "$applicant" },
        { $sort: { createdAt: -1 } }
      ])
      .toArray();

    return NextResponse.json({ applications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
