import { useGetNewsQuery } from "../../services/newsApi";
import { useGetVideosQuery } from "../../services/videoApi";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { stripHtml } from "../../lib/utils";
import { useState } from "react";

const topics = ["#Elections2026", "#TamilNadu", "#IndiaEconomy", "#IPL2026", "#ISRO", "#AIPolicy", "#ChennaiMetro", "#Budget2026"];

export function ContentSection() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const { data: tamilNewsRes } = useGetNewsQuery({ category: 'tamilnadu', limit: 3 });
  const { data: indiaNewsRes } = useGetNewsQuery({ category: 'india', limit: 4 });
  const { data: trendingNewsRes } = useGetNewsQuery({ limit: 5, page: 3 });
  const { data: videosRes } = useGetVideosQuery({ limit: 5 });

  const tamilNews = tamilNewsRes?.items || [];
  const nationalNews = indiaNewsRes?.items || [];
  const trendingItems = trendingNewsRes?.items || [];
  const videos = videosRes?.items || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 py-7">
      <main className="flex flex-col gap-8">
        {/* Videos Section - Dark Theme like Indian Express Express Videos */}
        <div className="bg-mv-black text-white p-6 rounded-lg shadow-xl -mx-4 lg:mx-0">
          <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-2">
            <h2 className="font-display text-[22px] font-black uppercase tracking-wide text-red-700">Trending Videos</h2>
            <Link to="/videos" className="text-mv-red font-ui text-[13px] font-bold hover:text-white transition-colors">View All &rarr;</Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            {/* Main Featured Video */}
            {videos.length > 0 && (
              <div className="w-full h-full flex flex-col">
                <div className="w-full aspect-video rounded overflow-hidden bg-black shadow-lg">
                  <iframe
                    title={videos[activeVideoIndex].title}
                    src={`https://www.youtube.com/embed/${videos[activeVideoIndex].youtubeId}?autoplay=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
                <div className="mt-4">
                  <div className="bg-mv-red text-white text-[10px] font-bold uppercase px-2 py-1 inline-block mb-2 rounded-sm tracking-wider">Now Playing</div>
                  <h3 className="font-display text-[20px] md:text-[24px] font-bold leading-tight">{videos[activeVideoIndex].title}</h3>
                  <p className="font-ui text-[13px] text-gray-400 mt-2 line-clamp-2">{videos[activeVideoIndex].description}</p>
                </div>
              </div>
            )}
            
            {/* Side Videos */}
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {videos.map((video, idx) => (
                <button 
                  key={video._id} 
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`group flex gap-3 block border-b border-gray-800 pb-4 last:border-0 last:pb-0 text-left transition-all ${activeVideoIndex === idx ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                >
                  <div className={`w-[100px] h-[64px] rounded overflow-hidden relative shrink-0 border-2 ${activeVideoIndex === idx ? 'border-mv-red' : 'border-transparent'}`}>
                    <img src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {activeVideoIndex !== idx && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px] bg-mv-red/80 rounded-full flex items-center justify-center text-[10px] text-white pl-0.5">▶</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-serif text-[14px] font-semibold leading-snug transition-colors line-clamp-2 ${activeVideoIndex === idx ? 'text-mv-red' : 'group-hover:text-mv-red'}`}>{video.title}</h4>
                    <div className="text-[10px] text-gray-400 mt-1">{formatDistanceToNow(new Date(video.publishedAt || video.createdAt))} ago</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Grid: Tamil Nadu vs National */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-mv-border pt-6">
          <div className="flex flex-col gap-4">
            <h2 className="font-ui text-[16px] font-black text-mv-black uppercase border-l-4 border-mv-red pl-3 leading-none tracking-widest">Tamil Nadu</h2>
            {tamilNews.map((card, idx) => (
              <Link to={`/news/${card.slug}`} key={card._id} className={`group block ${idx !== tamilNews.length - 1 ? "border-b border-mv-gray-100 pb-4" : ""}`}>
                <div className={`grid ${idx === 0 ? "grid-cols-1 gap-3" : "grid-cols-[1fr_80px] gap-4"}`}>
                  {idx === 0 && (
                    <div className="w-full aspect-[16/9] rounded overflow-hidden">
                      <img src={card.imageUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&q=80"} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <h3 className={`font-display font-bold leading-tight mb-2 group-hover:text-mv-red transition-colors ${idx === 0 ? "text-[20px]" : "text-[15px]"}`}>{card.title}</h3>
                    {idx === 0 && <p className="font-serif text-[14px] text-mv-gray-700 line-clamp-2 mb-2">{stripHtml(card.description || card.content || '')}</p>}
                    <div className="text-[10px] font-ui text-mv-gray-500 uppercase">{formatDistanceToNow(new Date(card.publishedAt || card.createdAt))} ago</div>
                  </div>
                  {idx !== 0 && (
                     <div className="w-[80px] h-[60px] rounded overflow-hidden">
                      <img src={card.imageUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&q=80"} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                     </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-ui text-[16px] font-black text-mv-black uppercase border-l-4 border-mv-red pl-3 leading-none tracking-widest">National News</h2>
            {nationalNews.map((card, idx) => (
              <Link to={`/news/${card.slug}`} key={card._id} className={`group block ${idx !== nationalNews.length - 1 ? "border-b border-mv-gray-100 pb-4" : ""}`}>
                 <div className={`grid ${idx === 0 ? "grid-cols-1 gap-3" : "grid-cols-[1fr_80px] gap-4"}`}>
                  {idx === 0 && (
                    <div className="w-full aspect-[16/9] rounded overflow-hidden">
                      <img src={card.imageUrl || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&q=80"} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <h3 className={`font-display font-bold leading-tight mb-2 group-hover:text-mv-red transition-colors ${idx === 0 ? "text-[20px]" : "text-[15px]"}`}>{card.title}</h3>
                    {idx === 0 && <p className="font-serif text-[14px] text-mv-gray-700 line-clamp-2 mb-2">{stripHtml(card.description || card.content || '')}</p>}
                    <div className="text-[10px] font-ui text-mv-gray-500 uppercase">{formatDistanceToNow(new Date(card.publishedAt || card.createdAt))} ago</div>
                  </div>
                  {idx !== 0 && (
                     <div className="w-[80px] h-[60px] rounded overflow-hidden">
                      <img src={card.imageUrl || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&q=80"} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                     </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Opinion & Analysis */}
      
      </main>

      {/* Sidebar */}
      <aside className="w-full">
        <div className="lg:sticky lg:top-[80px] flex flex-col gap-6">
          
          <div className="w-full bg-white border border-dashed border-mv-gray-300 rounded h-[250px] flex flex-col items-center justify-center text-mv-gray-500 text-[11px] font-semibold tracking-wide uppercase gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="m8 21 4-4 4 4" />
              <path d="M12 17v4" />
            </svg>
            <span>Advertisement</span>
            <span className="text-[10px] text-mv-gray-400">300 x 250</span>
          </div>

          <div className="w-full bg-white border border-mv-border shadow-sm">
            <div className="bg-mv-black text-white px-4 py-3 text-[12px] font-bold tracking-widest uppercase flex items-center justify-between">
              <span>Trending Now</span>
              <div className="w-2 h-2 bg-mv-red rounded-full animate-pulse"></div>
            </div>
            <ul className="p-0 list-none m-0">
              {trendingItems.map((item, index) => (
                <li key={item._id} className={`group cursor-pointer hover:bg-white transition-colors ${index < trendingItems.length - 1 ? "border-b border-mv-gray-100" : ""}`}>
                  <Link to={`/news/${item.slug}`} className="flex items-start gap-4 px-4 py-4">
                    <div className="font-display text-[24px] font-black text-mv-gray-300 leading-none group-hover:text-mv-red transition-colors mt-1">{String(index + 1).padStart(2, '0')}</div>
                    <div>
                      <div className="font-serif text-[14px] font-bold leading-snug group-hover:text-mv-red transition-colors line-clamp-2">{item.title}</div>
                      <div className="text-[10px] text-mv-gray-400 mt-2 font-ui uppercase">{formatDistanceToNow(new Date(item.publishedAt || item.createdAt))} ago</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full bg-white border border-mv-border shadow-sm p-5">
            <div className="text-[12px] font-black tracking-widest uppercase text-mv-black mb-4 border-b-2 border-mv-red inline-block pb-1">Topics in News</div>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <span key={topic} className="bg-white border border-mv-gray-300 text-mv-black px-3 py-1 text-[11px] font-bold cursor-pointer hover:bg-mv-red hover:border-mv-red hover:text-white transition-all shadow-sm">
                  {topic}
                </span>
              ))}
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
}
