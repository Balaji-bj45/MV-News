import {
  CandidateSpotlightCard,
  EmptyState,
  ErrorState,
  PageLoader,
  SectionIntro,
  Seo,
  pageShell,
} from '../components/ui';
import { useGetCandidatesQuery } from '../services/candidateApi';

export default function CandidatesPage() {
  const candidateResponse = useGetCandidatesQuery();

  return (
    <>
      <Seo
        title={`Candidates | MV News`}
        description={`View all candidates.`}
      />

      <section className={`${pageShell} space-y-8 py-10`}>
        <SectionIntro
          eyebrow="Profiles"
          title="All Candidates"
          description="Browse profiles of all participating candidates."
        />

        <div className="space-y-6">
          {candidateResponse.isLoading ? (
            <PageLoader />
          ) : candidateResponse.isError ? (
            <ErrorState message="Unable to load candidates right now." />
          ) : candidateResponse.data && candidateResponse.data.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {candidateResponse.data.map((candidate) => (
                <CandidateSpotlightCard key={candidate._id} candidate={candidate} />
              ))}
            </div>
          ) : (
            <EmptyState title="No candidates yet" body="There are no candidate profiles to display at the moment." />
          )}
        </div>
      </section>
    </>
  );
}
