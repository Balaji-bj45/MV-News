import { useGetAdvertisementsQuery } from '../../services/advertisementApi';

export function AddBanner() {
  const { data: ads, isLoading } = useGetAdvertisementsQuery('top_banner');
  const ad = ads?.[0];

  if (isLoading) {
    return (
      <div className="bg-white border-b border-mv-border flex justify-center w-full py-2">
        <div className="w-full max-w-[1200px] h-[200px] bg-mv-gray-100 animate-pulse flex items-center justify-center text-mv-gray-400 text-sm font-semibold tracking-wide uppercase">
          Loading Advertisement...
        </div>
      </div>
    );
  }

  if (!ad || !ad.isActive || !ad.imageUrl) {
    return (
      <div className="bg-white border-b border-mv-border flex justify-center w-full py-2">
        <div className="w-full max-w-[1200px] h-[200px] bg-mv-gray-50 border border-dashed border-mv-gray-300 flex flex-col items-center justify-center text-mv-gray-400 text-sm font-semibold tracking-wide uppercase gap-2">
          Advertisement Space
          <span className="text-[11px] opacity-70">Recommended Size: 1200 x 200</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-mv-border flex justify-center w-full py-2 bg-gray-50">
      {ad.targetUrl ? (
        <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="block w-full max-w-[1200px]">
          <img src={ad.imageUrl} alt="Advertisement" className="w-full h-[200px] object-contain mx-auto" />
        </a>
      ) : (
        <img src={ad.imageUrl} alt="Advertisement" className="w-full max-w-[1200px] h-[200px] object-contain mx-auto" />
      )}
    </div>
  );
}
