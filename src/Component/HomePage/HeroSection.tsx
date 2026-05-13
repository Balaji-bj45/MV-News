import { useGetNewsQuery } from '../../services/newsApi';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { stripHtml } from '../../lib/utils';

export function HeroSection() {
  const { data: mvFeaturedData, isLoading: mvFeaturedLoading } = useGetNewsQuery({ isFeatured: true, category: 'mvnews', limit: 1 });
  const { data: mvLatestData, isLoading: mvLatestLoading } = useGetNewsQuery({ category: 'mvnews', limit: 10, page: 1 });
  const { data: allNewsData, isLoading: allNewsLoading } = useGetNewsQuery({ category: 'tamilnadu', limit: 5, page: 1 });

  if (mvFeaturedLoading || mvLatestLoading || allNewsLoading) {
    return <div className="h-[400px] flex items-center justify-center font-ui text-mv-gray-500">Loading Latest News...</div>;
  }

  const mvFeaturedItems = mvFeaturedData?.items || [];
  const mvLatestItems = mvLatestData?.items || [];
  const allNewsItems = allNewsData?.items || [];
  
  // Featured Story: exclusively MV news featured, fallback to MV news latest
  const featuredStory = mvFeaturedItems[0] || mvLatestItems[0] || allNewsItems[0];
  
  // Left Column (Top News): remains standard news
  const topNews = allNewsItems.filter(n => n._id !== featuredStory?._id).slice(0, 4);
  
  // Right Column (Latest Updates): show only MV Latest updated news
  const latestNews = mvLatestItems.filter(n => n._id !== featuredStory?._id).slice(0, 5);

  if (!featuredStory) {
    return null;
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 py-6 border-b border-mv-border">
      {/* Left Column: Top News */}
      <aside className="hidden lg:flex flex-col gap-5 border-r border-mv-border pr-6">
        <h2 className="font-ui text-[14px] font-bold text-mv-red uppercase tracking-widest border-b-2 border-mv-black inline-block pb-1 mb-2">Top News</h2>
        {topNews.map((story, idx) => (
          <Link key={story._id} to={`/news/${story.slug}`} className={`group block ${idx !== topNews.length - 1 ? 'border-b border-mv-gray-100 pb-4' : ''}`}>
            <h3 className="font-display text-[16px] font-bold leading-tight group-hover:text-mv-red transition-colors mb-2">{story.title}</h3>
            <p className="font-serif text-[13px] text-mv-gray-600 line-clamp-2 mb-2">{stripHtml(story.description || story.content || '')}</p>
            <div className="text-[10px] text-mv-gray-400 font-ui uppercase">
              {formatDistanceToNow(new Date(story.publishedAt || story.createdAt))} ago
            </div>
          </Link>
        ))}
      </aside>

      {/* Middle Column: Featured Story */}
      <article className="flex flex-col group cursor-pointer lg:px-2">
        <Link to={`/news/${featuredStory.slug}`} className="block">
          <div className="text-[11px] font-bold text-mv-red tracking-widest uppercase mb-2 font-ui">
            {featuredStory.category}
          </div>
          <h1 className="font-display text-[28px] md:text-[36px] font-black leading-[1.1] text-mv-black mb-3 group-hover:text-mv-red transition-colors">
            {featuredStory.title}
          </h1>
          <p className="font-serif text-[16px] leading-relaxed text-mv-gray-700 mb-4">
            {stripHtml(featuredStory.description || featuredStory.content || '').slice(0, 250)}...
          </p>
          
          <div className="relative aspect-[16/10] overflow-hidden mb-4">
            <img 
              src={featuredStory.imageUrl || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900&q=80"} 
              alt={featuredStory.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
          <div className="flex items-center gap-2 text-[11px] text-mv-gray-500 font-ui">
            <span className="font-bold text-mv-black uppercase tracking-wider">By Editorial Desk</span>
            <span>|</span>
            <span>{formatDistanceToNow(new Date(featuredStory.publishedAt || featuredStory.createdAt))} ago</span>
          </div>
        </Link>
      </article>

      {/* Right Column: Latest Updates */}
      <aside className="flex flex-col gap-5 lg:border-l border-mv-border lg:pl-6 mt-6 lg:mt-0">
        <h2 className="font-ui text-[14px] font-bold text-mv-red uppercase tracking-widest border-b-2 border-mv-black inline-block pb-1 mb-2">MV News Latest Updates</h2>
        {latestNews.map((story, idx) => (
          <Link key={story._id} to={`/news/${story.slug}`} className={`group block flex gap-3 ${idx !== latestNews.length - 1 ? 'border-b border-mv-gray-100 pb-4' : ''}`}>
             <div className="w-[80px] h-[60px] rounded overflow-hidden shrink-0">
                <img 
                  src={story.imageUrl || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&q=80"} 
                  alt={story.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
            <div>
              <h3 className="font-display text-[14px] font-bold leading-tight group-hover:text-mv-red transition-colors line-clamp-3 mb-1">{story.title}</h3>
              <div className="text-[10px] text-mv-gray-400 font-ui uppercase">
                {formatDistanceToNow(new Date(story.publishedAt || story.createdAt))} ago
              </div>
            </div>
          </Link>
        ))}
      </aside>
    </section>
  );
}
