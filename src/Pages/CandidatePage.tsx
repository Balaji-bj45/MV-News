import { CalendarDays, Landmark, ScrollText, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorState, IconStat, PageLoader, Seo, ShareButtons, pageShell } from '../components/ui';
import { formatDate, getCandidateBio, getCandidateDisplayName } from '../lib/utils';
import { useGetCandidateByIdQuery } from '../services/candidateApi';
import type { LanguageCode } from '../types';

export default function CandidatePage() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const language = (i18n.language === 'ta' ? 'ta' : 'en') as LanguageCode;
  const candidateResponse = useGetCandidateByIdQuery(id ?? '', { skip: !id });
  const candidate = candidateResponse.data;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (candidateResponse.isLoading) {
    return <PageLoader fullHeight />;
  }

  if (candidateResponse.isError || !candidate) {
    return (
      <div className={`${pageShell} py-12`}>
        <ErrorState message="Candidate profile could not be loaded." />
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`${getCandidateDisplayName(candidate, language)} | MV News`}
        description={`${candidate.party} candidate for ${candidate.constituency}`}
      />

      <section className={`${pageShell} space-y-10 py-10`}>
        <div className="overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white shadow-xl shadow-stone-200/40">
          <div className="grid gap-0 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="bg-white">
              {candidate.photoUrl ? (
                <img src={candidate.photoUrl} alt={candidate.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-[22rem] items-center justify-center bg-gradient-to-br from-red-700 to-stone-900 text-white">
                  <Landmark className="h-16 w-16 opacity-70" />
                </div>
              )}
            </div>
            <div className="space-y-6 p-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-red-700">{candidate.party}</p>
                <h1 className="mt-3 font-display text-4xl font-black text-stone-900">
                  {getCandidateDisplayName(candidate, language)}
                </h1>
                <p className="mt-3 text-lg text-stone-600">{candidate.constituency}</p>
              </div>
              <p className="max-w-3xl text-base leading-8 text-stone-700">{getCandidateBio(candidate, language)}</p>
              <div className="grid gap-4 md:grid-cols-3">
                <IconStat icon={<Landmark className="h-5 w-5" />} label="Party" value={candidate.party} />
                <IconStat icon={<Sparkles className="h-5 w-5" />} label="Promises" value={`${candidate.promises.length}`} />
                <IconStat icon={<CalendarDays className="h-5 w-5" />} label="Timeline events" value={`${candidate.timeline.length}`} />
              </div>
              <ShareButtons url={currentUrl} title={getCandidateDisplayName(candidate, language)} />
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-red-700" />
              <h2 className="font-display text-3xl font-black text-stone-900">Campaign promises</h2>
            </div>
            <div className="mt-6 space-y-4">
              {candidate.promises.map((item) => (
                <div key={`${item.title}-${item.description}`} className="rounded-[1.5rem] bg-white p-5">
                  <h3 className="text-lg font-semibold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ScrollText className="h-5 w-5 text-red-700" />
              <h2 className="font-display text-3xl font-black text-stone-900">Timeline</h2>
            </div>
            <div className="mt-6 space-y-5">
              {candidate.timeline.map((item) => (
                <div key={`${item.date}-${item.event}`} className="relative pl-6">
                  <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-red-700" />
                  <div className="rounded-[1.5rem] bg-white p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-500">
                      {formatDate(item.date, language)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-700">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
