import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  
  const news = await db.collection('news').find({}).toArray();
  
  return NextResponse.json({
    totalCount: news.length,
    recentNews: news.slice(0, 3)
  });
}
