import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CandidateSpotlightCard,
  EmptyState,
  ErrorState,
  NewsCard,
  PageLoader,
  Pagination,
  SectionIntro,
  Seo,
  pageShell,
} from '../components/ui';
import { useGetCandidatesQuery } from '../services/candidateApi';
import { useGetNewsQuery } from '../services/newsApi';
import type { NewsCategory } from '../types';

const validCategories: NewsCategory[] = ['india', 'tamilnadu', 'candidate', 'mvnews'];

export default function CategoryPage() {
  const { t } = useTranslation();
  const { name } = useParams();
  const [page, setPage] = useState(1);

  const category = validCategories.includes((name ?? '').toLowerCase() as NewsCategory)
    ? ((name ?? '').toLowerCase() as NewsCategory)
    : null;

  useEffect(() => {
    setPage(1);
  }, [category]);

  const newsResponse = useGetNewsQuery(category ? { category, page, limit: 8 } : undefined, {
    skip: !category,
  });
  const candidateResponse = useGetCandidatesQuery();
  const highlightedCandidate = candidateResponse.data?.find((item) => item.isActive) ?? candidateResponse.data?.[0];

  if (!category) {
    return (
      <div className={`${pageShell} py-14`}>
        <EmptyState title="Unknown category" body="Use one of the supported categories: India, Tamil Nadu, Candidate, or MV News." />
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`${category} news | MV News`}
        description={`Latest ${category} political updates, filtered directly from the news API.`}
      />

      <section className={`${pageShell} space-y-8 py-10`}>
        <SectionIntro
          eyebrow={t('common.latest')}
          title={t(`categories.${category}`)}
          description="Curated reporting for this section, with quick access to a featured candidate profile."
        />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            {newsResponse.isLoading ? (
              <PageLoader />
            ) : newsResponse.isError ? (
              <ErrorState message="Unable to load category news right now." />
            ) : newsResponse.data?.items.length ? (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  {newsResponse.data.items.map((news) => (
                    <NewsCard key={news._id} news={news} compact />
                  ))}
                </div>
                <Pagination pagination={newsResponse.data.pagination} onChange={setPage} />
              </>
            ) : (
              <EmptyState title="No stories yet" body="This category is ready, but the API has not returned any items for it yet." />
            )}
          </div>

          <div className="space-y-6">
            {candidateResponse.isLoading ? (
              <PageLoader />
            ) : highlightedCandidate ? (
              <CandidateSpotlightCard candidate={highlightedCandidate} />
            ) : (
              <EmptyState title="No candidate profile" body="Create a candidate in the dashboard to populate this sidebar card." />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
