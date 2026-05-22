import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Upload, ImageIcon, Link as LinkIcon } from 'lucide-react';
import {
  useGetAdvertisementsQuery,
  useUpdateAdvertisementMutation,
  type Advertisement,
} from '../../services/advertisementApi';
import { uploadImage } from '../../services/upload';
import { Seo, PageLoader } from '../../components/ui';

export default function AdsManager() {
  const { data: ads, isLoading } = useGetAdvertisementsQuery();
  const [updateAd] = useUpdateAdvertisementMutation();

  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, position: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading({ ...uploading, [position]: true });
    try {
      const uploadResult = await uploadImage(file);
      await updateAd({ position, payload: { imageUrl: uploadResult.imageUrl, isActive: true } }).unwrap();
      toast.success('Ad banner updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading({ ...uploading, [position]: false });
    }
  };

  const handleUrlUpdate = async (position: string, url: string) => {
    try {
      await updateAd({ position, payload: { targetUrl: url } }).unwrap();
      toast.success('Ad URL updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update URL');
    }
  };

  if (isLoading) return <PageLoader />;

  const getAd = (position: Advertisement['position']) => ads?.find((ad) => ad.position === position);

  return (
    <>
      <Seo
        title="Manage Advertisements | Admin"
        description="Upload and manage advertisement banners shown across the MV News experience."
      />
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Advertisements</h1>
          <p className="mt-2 text-gray-600">Update the banners displayed on the home page and sidebar.</p>
        </div>

        <div className="grid gap-8">
          <AdCard
            title="Top Banner Ad"
            description="Displayed on the home page above the main content."
            recommendedSize="Recommended size: 1200 x 200 pixels"
            ad={getAd('top_banner')}
            onUpload={(e) => handleImageUpload(e, 'top_banner')}
            onUrlUpdate={(url) => handleUrlUpdate('top_banner', url)}
            isUploading={uploading['top_banner']}
          />

          <AdCard
            title="Sidebar Banner Ad"
            description="Displayed on the right sidebar of the home page."
            recommendedSize="Recommended size: 300 x 250 pixels"
            ad={getAd('sidebar_banner')}
            onUpload={(e) => handleImageUpload(e, 'sidebar_banner')}
            onUrlUpdate={(url) => handleUrlUpdate('sidebar_banner', url)}
            isUploading={uploading['sidebar_banner']}
          />
        </div>
      </div>
    </>
  );
}

function AdCard({
  title,
  description,
  recommendedSize,
  ad,
  onUpload,
  onUrlUpdate,
  isUploading,
}: {
  title: string;
  description: string;
  recommendedSize: string;
  ad?: Advertisement;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlUpdate: (url: string) => void;
  isUploading: boolean;
}) {
  const [url, setUrl] = useState(ad?.targetUrl || '');

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        <p className="text-xs font-medium text-red-600 mt-2">{recommendedSize}</p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center relative group">
            {ad?.imageUrl ? (
              <img src={ad.imageUrl} alt={title} className="max-h-48 mx-auto object-contain rounded" />
            ) : (
              <div className="py-12 flex flex-col items-center text-gray-400">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p>No image uploaded yet</p>
              </div>
            )}
            
            <div className={`absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center ${ad?.imageUrl ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity`}>
              <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-gray-50">
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload New Image'}
                <input type="file" className="hidden" accept="image/*" onChange={onUpload} disabled={isUploading} />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Link URL</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border"
              />
            </div>
            <button
              onClick={() => onUrlUpdate(url)}
              className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Save URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
