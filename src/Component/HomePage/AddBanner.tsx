import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetAdvertisementsQuery } from '../../services/advertisementApi';

export function AddBanner() {
  const { data: ads, isLoading } = useGetAdvertisementsQuery('top_banner');
  const activeAds = (ads ?? []).filter((ad) => ad.isActive && ad.imageUrl);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= activeAds.length) {
      setCurrentIndex(0);
    }
  }, [activeAds.length, currentIndex]);

  useEffect(() => {
    if (activeAds.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % activeAds.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [activeAds.length]);

  if (isLoading) {
    return (
      <div className="border-b border-mv-border bg-white px-4 py-3">
        <div className="mx-auto h-[160px] w-full max-w-[1200px] animate-pulse rounded-[28px] bg-mv-gray-100 sm:h-[220px] lg:h-[300px]" />
      </div>
    );
  }

  if (activeAds.length === 0) {
    return (
      <div className="border-b border-mv-border bg-white px-4 py-3">
        <div className="mx-auto flex h-[160px] w-full max-w-[1200px] flex-col items-center justify-center gap-2 rounded-[28px] border border-dashed border-mv-gray-300 bg-mv-gray-50 text-mv-gray-400 sm:h-[220px] lg:h-[300px]">
          <span className="text-sm font-semibold uppercase tracking-[0.24em]">Advertisement Space</span>
          <span className="text-xs opacity-75">Recommended Size: 1200 x 300 pixels</span>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((current) => (current - 1 + activeAds.length) % activeAds.length);
  };

  const goToNext = () => {
    setCurrentIndex((current) => (current + 1) % activeAds.length);
  };

  return (
    <div className="border-b border-mv-border bg-white px-4 py-3">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="relative overflow-hidden rounded-[28px] bg-stone-900 shadow-xl shadow-stone-300/30">
          <div className="relative h-[160px] sm:h-[220px] lg:h-[300px]">
            {activeAds.map((ad, index) => {
              const slide = (
                <>
                  <img
                    src={ad.imageUrl}
                    alt="Homepage advertisement"
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent px-5 py-4 text-white">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/85">
                        Sponsored Banner
                      </span>
                      <span className="text-[11px] font-medium text-white/75">
                        {String(index + 1).padStart(2, '0')} / {String(activeAds.length).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </>
              );

              return (
                <div
                  key={ad._id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                >
                  {ad.targetUrl ? (
                    <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
                      {slide}
                    </a>
                  ) : (
                    <div className="h-full w-full">{slide}</div>
                  )}
                </div>
              );
            })}

            {activeAds.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label="Show previous banner"
                  className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Show next banner"
                  className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </div>

          {activeAds.length > 1 ? (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/35 px-3 py-2 backdrop-blur">
              {activeAds.map((ad, index) => (
                <button
                  key={ad._id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to banner ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/55'
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
