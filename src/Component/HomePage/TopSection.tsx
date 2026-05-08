import { useGetNewsQuery } from '../../services/newsApi';
import { format } from 'date-fns';

export function TopSection() {
  const { data: newsData } = useGetNewsQuery({ limit: 10, page: 1 });
  const fetchedItems = newsData?.items?.map(item => item.title) || [];
  
  const tickerItems = fetchedItems.length > 0 ? fetchedItems : [
    "Loading latest updates...",
  ];

  const doubledTickerItems = [...tickerItems, ...tickerItems];

  return (
    <>
      <div className="bg-white border-b border-mv-border text-center py-2 px-3 text-[11px] text-mv-gray-500 tracking-wide">
        <span className="inline-block bg-mv-gray-300 text-mv-gray-700 px-3 py-0.5 rounded-sm text-[10px] mr-2 font-semibold">ADVERTISEMENT</span>
        Premium placement available - contact ads@maanbumigu.com
      </div>

      <div className="bg-mv-red text-white flex items-center overflow-hidden h-8">
        <div className="bg-mv-red-dark px-4 h-full flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase whitespace-nowrap shrink-0 z-10 relative">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          BREAKING
        </div>
        <div className="overflow-hidden flex-1 relative h-full">
          {/* Use CSS custom property for infinite scroll animation */}
          <style>{`
            @keyframes ticker {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-ticker {
              animation: ticker 40s linear infinite;
            }
            .animate-ticker:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="flex whitespace-nowrap animate-ticker h-8 items-center text-[12.5px] font-medium w-max">
            {doubledTickerItems.map((item, index) => (
              <span key={`${item}-${index}`} className="px-6 flex items-center">
                <span className="opacity-70 text-[8px] mr-2.5">•</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-5 lg:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 py-2.5 border-b border-mv-border text-[11.5px] text-mv-gray-500">
          <span>{format(new Date(), 'EEEE, MMMM d, yyyy')} | Chennai, Tamil Nadu</span>
          <span className="bg-mv-black text-white px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-sm">Tamil Nadu Edition</span>
          <span>e-Paper | Newsletters | Podcasts</span>
        </div>
      </div>
    </>
  );
}
