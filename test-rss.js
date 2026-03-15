const Parser = require('rss-parser');
const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  }
});

const source = { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' };
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

parser.parseURL(source.url).then(feed => {
  console.log('Got', feed.items.length, 'items');
  for (let i = 0; i < 2; i++) {
    const item = feed.items[i];
    const itemDate = item.pubDate ? new Date(item.pubDate) : (item.isoDate ? new Date(item.isoDate) : new Date());
    console.log(itemDate, typeof itemDate, itemDate < thirtyDaysAgo ? 'OLDER' : 'NEWER');
  }
}).catch(e => console.error(e));
