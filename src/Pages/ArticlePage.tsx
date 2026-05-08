import DOMPurify from 'dompurify';
import { useParams, Link } from 'react-router-dom';
import { ErrorState, PageLoader, Seo, ShareButtons } from '../components/ui';
import { stripHtml } from '../lib/utils';
import { useGetNewsBySlugQuery, useGetNewsQuery } from '../services/newsApi';

export default function ArticlePage() {
  const { slug } = useParams();
  const articleResponse = useGetNewsBySlugQuery(slug ?? '', { skip: !slug });
  const article = articleResponse.data;

  const relatedResponse = useGetNewsQuery(
    article ? { category: article.category, limit: 5, page: 1 } : undefined,
    { skip: !article },
  );

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const relatedNews = relatedResponse.data?.items.filter((item) => item.slug !== slug).slice(0, 4) ?? [];

  if (articleResponse.isLoading) {
    return <PageLoader fullHeight />;
  }

  if (articleResponse.isError || !article) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <ErrorState message="We could not load this article. It might have been removed." />
      </div>
    );
  }

  return (
    <>
      <Seo title={`${article.title} | MV News`} description={stripHtml(article.description || article.content || article.title)} />

      <main className="bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-mv-border bg-white">
          <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-2">
            <nav className="flex text-[11px] font-ui font-semibold uppercase tracking-wider text-mv-gray-500">
              <Link to="/" className="hover:text-mv-red transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link to={`/category/${article.category}`} className="hover:text-mv-red transition-colors">{article.category}</Link>
              <span className="mx-2">/</span>
              <span className="text-mv-gray-400 truncate max-w-[200px] md:max-w-md">{article.title}</span>
            </nav>
          </div>
        </div>

        <article className="mx-auto max-w-[1200px] px-4 md:px-6 py-8 md:py-12">
          
          {/* Article Header */}
          <header className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="font-display text-[32px] md:text-[48px] lg:text-[56px] font-black leading-[1.1] text-mv-ink mb-6">
              {article.title}
            </h1>
            <h2 className="font-serif text-[18px] md:text-[22px] leading-relaxed text-mv-gray-600 mb-8 max-w-3xl mx-auto">
              {stripHtml(article.description || '').slice(0, 300)}
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 border-y border-mv-border py-4 font-ui text-[13px] text-mv-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-mv-ink uppercase tracking-wider">Written by</span>
                <span className="text-mv-red font-bold">{article.source || 'MV Desk'}</span>
              </div>
              <div className="hidden md:block w-1 h-1 rounded-full bg-mv-gray-300"></div>
              <div>
                <span className="uppercase tracking-wider">Published:</span> {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="hidden md:block w-1 h-1 rounded-full bg-mv-gray-300"></div>
              <div className="flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                 <span>{article.viewCount} views</span>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          {article.imageUrl && (
            <figure className="mb-12 max-w-5xl mx-auto">
              <div className="w-full aspect-video bg-white overflow-hidden relative border border-mv-border shadow-md">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="text-right text-[11px] font-ui text-mv-gray-500 mt-2 uppercase tracking-wide">
                Image Source: {article.source}
              </figcaption>
            </figure>
          )}

          {/* Main Layout: Content + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            
            {/* Article Content */}
            <div className="max-w-2xl mx-auto w-full lg:max-w-none">
               {/* First paragraph drop cap via CSS styling */}
              <div
                className="news-prose text-[18px] md:text-[20px] first-letter:float-left first-letter:text-7xl first-letter:pr-2 first-letter:font-display first-letter:text-mv-red first-letter:leading-[0.8] first-letter:font-black"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(article.content || `<p>${article.description || ''}</p>`),
                }}
              />
              
              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-mv-border flex flex-wrap gap-2 items-center">
                  <span className="font-ui text-[12px] font-bold uppercase tracking-widest text-mv-gray-500 mr-2">Tags:</span>
                  {article.tags.map((tag) => (
                    <span key={tag} className="bg-white border border-mv-border px-3 py-1 text-[11px] font-bold text-mv-ink uppercase hover:bg-mv-red hover:text-white transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="w-full">
              <div className="sticky top-[100px] flex flex-col gap-8">
                
                {/* Sharing Block */}
                <div className="p-6 bg-white border border-mv-border">
                  <h3 className="font-ui text-[14px] font-black uppercase tracking-widest border-b-2 border-mv-ink inline-block pb-1 mb-4 text-mv-ink">Share Article</h3>
                  <ShareButtons url={currentUrl} title={article.title} />
                </div>
                
                {/* Related News */}
                <div>
                  <h3 className="font-ui text-[14px] font-black uppercase tracking-widest border-b-2 border-mv-red inline-block pb-1 mb-4 text-mv-ink">
                    More in {article.category}
                  </h3>
                  
                  {relatedResponse.isLoading ? (
                    <div className="text-sm text-mv-gray-500">Loading...</div>
                  ) : relatedNews.length ? (
                    <div className="flex flex-col gap-5">
                      {relatedNews.map((item, idx) => (
                        <Link to={`/news/${item.slug}`} key={item._id} className={`group block ${idx !== relatedNews.length - 1 ? 'border-b border-mv-border pb-5' : ''}`}>
                          <div className="flex gap-4">
                            {item.imageUrl && (
                              <div className="w-[80px] h-[60px] shrink-0 bg-white overflow-hidden">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-display text-[15px] font-bold leading-tight group-hover:text-mv-red transition-colors line-clamp-3">
                                {item.title}
                              </h4>
                              <div className="text-[10px] font-ui uppercase text-mv-gray-400 mt-2">
                                {new Date(item.publishedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-mv-gray-500 italic">No related stories available.</p>
                  )}
                </div>

                {/* Ad Placeholder */}
                 <div className="w-full bg-white border border-dashed border-mv-gray-300 h-[250px] flex flex-col items-center justify-center text-mv-gray-500 text-[11px] font-semibold tracking-wide uppercase gap-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="m8 21 4-4 4 4" />
                    <path d="M12 17v4" />
                  </svg>
                  <span>Advertisement</span>
                  <span className="text-[10px] text-mv-gray-400">300 x 250</span>
                </div>
              </div>
            </aside>
          </div>
        </article>
      </main>
    </>
  );
}
