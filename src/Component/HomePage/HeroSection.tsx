import { useGetNewsQuery } from '../../services/newsApi';
import { useGetCandidatesQuery } from '../../services/candidateApi';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { getCandidateDisplayName, getCandidateBio, stripHtml, truncate } from '../../lib/utils';
import { useTranslation } from 'react-i18next';
import type { Candidate, LanguageCode, News } from '../../types';
import mvGif from '../../assets/mvgif.gif';

export function HeroSection() {
  const { i18n } = useTranslation();
  const language = (i18n.language === 'ta' ? 'ta' : 'en') as LanguageCode;
  const { data: allNewsData, isLoading: allNewsLoading } = useGetNewsQuery({ category: 'tamilnadu', limit: 12, page: 1 });
  const { data: candidateData, isLoading: candidateLoading } = useGetCandidatesQuery();

  if (allNewsLoading || candidateLoading) {
    return <div className="h-[400px] flex items-center justify-center font-ui text-mv-gray-500">Loading Latest News...</div>;
  }

  const allNewsItems = allNewsData?.items || [];
  const featuredStory = [...allNewsItems].sort((left: News, right: News) => {
    if (right.viewCount !== left.viewCount) {
      return right.viewCount - left.viewCount;
    }

    return new Date(right.publishedAt || right.createdAt).getTime() - new Date(left.publishedAt || left.createdAt).getTime();
  })[0];
  const topNews = allNewsItems.filter(n => n._id !== featuredStory?._id).slice(0, 3);
  const featuredCandidates = [...(candidateData || [])]
    .sort((left: Candidate, right: Candidate) => {
      if (left.isActive !== right.isActive) {
        return left.isActive ? -1 : 1;
      }

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    })
    .slice(0, 6);

  // Retrieve the candidate explicitly marked as main candidate, or fall back to the first active candidate
  const mainCandidate = candidateData?.find(c => c.isMainCandidate) ||
    candidateData?.find(c => c.isActive) ||
    candidateData?.[0];

  if (!featuredStory && !mainCandidate) {
    return null;
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 py-6 border-b border-mv-border">
      {/* Left Column: Top News */}
      <aside className="hidden lg:flex flex-col gap-5 border-r border-mv-border pr-6">
        <h2 className="font-ui text-[14px] font-bold text-mv-red uppercase tracking-widest border-b-2 border-mv-black inline-block pb-1 mb-2">MV Top News</h2>
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

      {/* Middle Column: Main Candidate Profile / Featured Story */}
      <article className="flex flex-col group cursor-pointer lg:px-2">
        {mainCandidate ? (
          <Link to={`/candidate/${mainCandidate._id}`} className="block">
            <div className="text-[18px] font-bold text-mv-red tracking-widest uppercase mb-2 font-ui border-b-2 flex items-center gap-2 pb-1">
              <img src={mvGif} alt="MV News Bot" className="h-7 w-auto object-contain" />
              <span>{language === 'ta' ? 'முக்கிய வேட்பாளர்' : 'Featured Main Candidate'}</span>
            </div>
            <h1 className="font-display text-[28px] md:text-[36px] font-black leading-[1.1] text-mv-black mb-3 group-hover:text-mv-red transition-colors">
              {getCandidateDisplayName(mainCandidate, language)}
            </h1>
            <div className="flex items-center gap-2 text-[12px] text-mv-gray-500 font-ui uppercase font-bold mb-4">
              <span className="text-mv-red">{mainCandidate.party}</span>
              <span>|</span>
              <span>{mainCandidate.constituency}</span>
            </div>
            <p className="font-serif text-[16px] leading-relaxed text-mv-gray-700 mb-4 line-clamp-4">
              {stripHtml(getCandidateBio(mainCandidate, language))}
            </p>

            <div className="relative aspect-[16/10] overflow-hidden rounded bg-mv-gray-100 mb-4">
              <img
                src={mainCandidate.photoUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=80"}
                alt={mainCandidate.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </Link>
        ) : featuredStory ? (
          <Link to={`/news/${featuredStory.slug}`} className="block">
            <div className="text-[11px] font-bold text-mv-red tracking-widest uppercase mb-2 font-ui">
              Mv News Trending Now
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
        ) : null}
      </article>

      {/* Right Column: Latest Updates */}
      <aside className="flex flex-col gap-5 lg:border-l border-mv-border lg:pl-6 mt-6 lg:mt-0">
        <h2 className="font-ui text-[14px] font-bold text-mv-red uppercase tracking-widest border-b-2 border-mv-black inline-block pb-1 mb-2">MV Star Candidates News </h2>
        {featuredCandidates.map((candidate, idx) => (
          <Link key={candidate._id} to={`/candidate/${candidate._id}`} className={`group block flex gap-3 ${idx !== featuredCandidates.length - 1 ? 'border-b border-mv-gray-100 pb-4' : ''}`}>
            <div className="w-[80px] h-[60px] rounded overflow-hidden shrink-0 bg-mv-gray-100">
              <img
                src={candidate.photoUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80"}
                alt={candidate.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <h3 className="font-display text-[14px] font-bold leading-tight group-hover:text-mv-red transition-colors line-clamp-2 mb-1">
                {getCandidateDisplayName(candidate, language)}
              </h3>
              <p className="text-[11px] text-mv-gray-500 font-ui uppercase mb-1">{candidate.party}</p>
              <p className="font-serif text-[12px] text-mv-gray-600 line-clamp-2">
                {truncate(candidate.bio || candidate.bioInTamil || candidate.constituency, 72)}
              </p>
            </div>
          </Link>
        ))}
      </aside>
    </section>
  );
}
