import { getDb } from "./mongodb";
import { ObjectId } from "mongodb";

export async function createNotification({
  userId,
  message,
  type,
  link,
}: {
  userId: string | ObjectId;
  message: string;
  type: "comment_reply" | "startup_voted" | "job_posted" | "system" | "new_message";
  link?: string;
}) {
  try {
    const db = await getDb();
    const notification = {
      userId: new ObjectId(userId),
      message,
      type,
      link,
      isRead: false,
      createdAt: new Date(),
    };

    await db.collection("notifications").insertOne(notification);
    return true;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return false;
  }
}
