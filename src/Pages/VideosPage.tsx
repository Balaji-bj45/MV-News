import { PlayCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState, PageLoader, Pagination, SectionIntro, Seo, VideoBadge, pageShell } from '../components/ui';
import { getEmbeddedYoutubeUrl, stringifyTags } from '../lib/utils';
import { useGetVideosQuery } from '../services/videoApi';

export default function VideosPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const videoResponse = useGetVideosQuery({ page, limit: 9 });

  return (
    <>
      <Seo title="Videos | MV News" description="Watch embedded YouTube reports, interviews, and campaign coverage." />

      <section className={`${pageShell} space-y-8 py-10`}>
        <SectionIntro eyebrow={t('videos.title')} title={t('videos.title')} description={t('videos.subtitle')} />

        {videoResponse.isLoading ? (
          <PageLoader />
        ) : videoResponse.data?.items.length ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {videoResponse.data.items.map((video) => (
                <article key={video._id} className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
                  <div className="aspect-video overflow-hidden bg-stone-900">
                    <iframe
                      title={video.title}
                      src={getEmbeddedYoutubeUrl(video.youtubeId)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <VideoBadge />
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <h2 className="font-display text-2xl font-black text-stone-900">{video.title}</h2>
                    <p className="text-sm leading-6 text-stone-600">{video.description || 'Watch the full report on YouTube.'}</p>
                    {video.tags.length ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                        <PlayCircle className="h-3.5 w-3.5" />
                        {stringifyTags(video.tags)}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
            <Pagination pagination={videoResponse.data.pagination} onChange={setPage} />
          </>
        ) : (
          <EmptyState title="No videos yet" body="Add YouTube IDs from the admin dashboard to populate this page." />
        )}
      </section>
    </>
  );
}
