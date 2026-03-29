import { Navbar } from '@/components/navbar';
import { ContentExplorer, NewsItem, StartupItem } from '@/components/content-explorer';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { LandingContent } from '@/components/landing-content';

export const dynamic = 'force-dynamic';

async function getNews(): Promise<NewsItem[]> {
  try {
    const db = await getDb();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const news = await db.collection('news')
      .find({
        date: { $gte: thirtyDaysAgo }
      })
      .sort({ date: -1 })
      .toArray();
    
    return news.map(item => ({
      _id: item._id.toString(),
      toolName: item.toolName || '',
      company: item.company || '',
      summary: item.summary || '',
      link: item.link || '',
      date: item.date instanceof Date ? item.date.toISOString() : new Date(item.date).toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}

async function getStartups(): Promise<StartupItem[]> {
  try {
    const db = await getDb();
    const session = await getSession();
    const userId = session?.user?.id;

    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    
    const startups = await db.collection('startups')
      .find({
        date: { $gte: twoYearsAgo },
        status: { $ne: 'pending_approval' }
      })
      .sort({ date: -1 })
      .toArray();

    let likedIds: string[] = [];
    if (userId) {
      const upvotes = await db.collection("upvotes").find({
        userId: new ObjectId(userId)
      }).toArray();
      likedIds = upvotes.map(uv => uv.targetId.toString());
    }
    
    return startups.map(item => ({
      _id: item._id.toString(),
      name: item.name || '',
      description: item.description || '',
      link: item.link || '',
      source: item.source || '',
      tags: item.tags || [],
      date: item.date instanceof Date ? item.date.toISOString() : new Date(item.date).toISOString(),
      isLiked: likedIds.includes(item._id.toString()),
      founderId: item.founderId?.toString()
    }));
  } catch (error) {
    console.error('Failed to fetch startups:', error);
    return [];
  }
}

export default async function Home() {
  const news = await getNews();
  const startups = await getStartups();

  return (
    <main className="min-h-screen bg-background dark:bg-[#020617] text-foreground dark:text-white selection:bg-teal-100 dark:selection:bg-emerald-500/30 selection:text-teal-900 dark:selection:text-emerald-200 transition-colors duration-700">
      <Navbar />
      
      <ContentExplorer initialNews={news} initialStartups={startups}>
        <LandingContent />
      </ContentExplorer>

    </main>
  );
}
