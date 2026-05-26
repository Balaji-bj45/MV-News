import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  ExternalLink,
  Eye,
  EyeOff,
  ImageIcon,
  Link as LinkIcon,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  useCreateAdvertisementMutation,
  useDeleteAdvertisementMutation,
  useGetAdvertisementsQuery,
  useUpdateAdvertisementMutation,
  type Advertisement,
  type AdvertisementInput,
  type AdvertisementPosition,
} from '../../services/advertisementApi';
import { uploadImage } from '../../services/upload';
import { Seo, PageLoader } from '../../components/ui';

type DraftAd = AdvertisementInput & {
  tempId: string;
};

const positionConfig: Record<
  AdvertisementPosition,
  {
    title: string;
    description: string;
    recommendedSize: string;
    previewHeightClassName: string;
    emptyMessage: string;
  }
> = {
  top_banner: {
    title: 'Top Banner Carousel',
    description: 'Displayed across the homepage as a rotating banner carousel.',
    recommendedSize: 'Recommended size: 1200 x 300 pixels',
    previewHeightClassName: 'h-[150px] sm:h-[220px]',
    emptyMessage: 'No top banners added yet.',
  },
  sidebar_banner: {
    title: 'Sidebar Ads',
    description: 'Displayed in the homepage sidebar. Lower display order shows first.',
    recommendedSize: 'Recommended size: 300 x 250 pixels',
    previewHeightClassName: 'h-[250px]',
    emptyMessage: 'No sidebar ads added yet.',
  },
};

const createDraftAd = (position: AdvertisementPosition, displayOrder: number): DraftAd => ({
  tempId: `${position}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  position,
  imageUrl: '',
  publicId: '',
  targetUrl: '',
  isActive: true,
  displayOrder,
});

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: unknown }).data;

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data === 'object' && data !== null && 'message' in data) {
      return String((data as { message?: string }).message ?? fallback);
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export default function AdsManager() {
  const { data: ads, isLoading } = useGetAdvertisementsQuery();
  const [createAdvertisement] = useCreateAdvertisementMutation();
  const [updateAdvertisement] = useUpdateAdvertisementMutation();
  const [deleteAdvertisement] = useDeleteAdvertisementMutation();
  const [drafts, setDrafts] = useState<Record<AdvertisementPosition, DraftAd[]>>({
    top_banner: [],
    sidebar_banner: [],
  });

  const groupedAds: Record<AdvertisementPosition, Advertisement[]> = {
    top_banner: (ads ?? []).filter((ad) => ad.position === 'top_banner'),
    sidebar_banner: (ads ?? []).filter((ad) => ad.position === 'sidebar_banner'),
  };

  const addDraft = (position: AdvertisementPosition) => {
    const nextOrder = groupedAds[position].length + drafts[position].length;
    setDrafts((current) => ({
      ...current,
      [position]: [...current[position], createDraftAd(position, nextOrder)],
    }));
  };

  const removeDraft = (position: AdvertisementPosition, tempId: string) => {
    setDrafts((current) => ({
      ...current,
      [position]: current[position].filter((ad) => ad.tempId !== tempId),
    }));
  };

  const handleCreate = async (tempId: string, payload: AdvertisementInput) => {
    try {
      await createAdvertisement(payload).unwrap();
      toast.success('Advertisement created successfully');
      removeDraft(payload.position, tempId);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create advertisement'));
      throw error;
    }
  };

  const handleUpdate = async (id: string, payload: Partial<AdvertisementInput>) => {
    try {
      await updateAdvertisement({ id, payload }).unwrap();
      toast.success('Advertisement updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update advertisement'));
      throw error;
    }
  };

  const handleDelete = async (ad: Advertisement) => {
    if (!window.confirm('Delete this advertisement?')) {
      return;
    }

    try {
      await deleteAdvertisement(ad._id).unwrap();
      toast.success('Advertisement deleted successfully');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete advertisement'));
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Seo
        title="Manage Advertisements | Admin"
        description="Create, update, reorder, and delete homepage banners and sidebar advertisements."
      />
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Advertisements</h1>
          <p className="mt-2 text-gray-600">
            Add multiple homepage banners for the carousel, manage sidebar ads, and keep image sizes aligned with the frontend layout.
          </p>
        </div>

        {(['top_banner', 'sidebar_banner'] as AdvertisementPosition[]).map((position) => {
          const config = positionConfig[position];
          const items = groupedAds[position];
          const sectionDrafts = drafts[position];

          return (
            <section key={position} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/80 p-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{config.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">{config.description}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-red-600">{config.recommendedSize}</p>
                </div>

                <button
                  type="button"
                  onClick={() => addDraft(position)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4" />
                  Add Banner
                </button>
              </div>

              <div className="space-y-6 p-6">
                {sectionDrafts.map((draft) => (
                  <AdEditorCard
                    key={draft.tempId}
                    mode="create"
                    position={position}
                    recommendedSize={config.recommendedSize}
                    previewHeightClassName={config.previewHeightClassName}
                    initialValue={draft}
                    onSave={(payload) => handleCreate(draft.tempId, payload)}
                    onDelete={() => removeDraft(position, draft.tempId)}
                  />
                ))}

                {items.length === 0 && sectionDrafts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500">
                    {config.emptyMessage}
                  </div>
                ) : null}

                {items.map((ad) => (
                  <AdEditorCard
                    key={ad._id}
                    mode="edit"
                    position={position}
                    recommendedSize={config.recommendedSize}
                    previewHeightClassName={config.previewHeightClassName}
                    initialValue={ad}
                    onSave={(payload) => handleUpdate(ad._id, payload)}
                    onDelete={() => handleDelete(ad)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function AdEditorCard({
  mode,
  position,
  recommendedSize,
  previewHeightClassName,
  initialValue,
  onSave,
  onDelete,
}: {
  mode: 'create' | 'edit';
  position: AdvertisementPosition;
  recommendedSize: string;
  previewHeightClassName: string;
  initialValue: Pick<AdvertisementInput, 'imageUrl' | 'publicId' | 'targetUrl' | 'isActive' | 'displayOrder'>;
  onSave: (payload: AdvertisementInput) => Promise<unknown>;
  onDelete: () => void;
}) {
  const [form, setForm] = useState<AdvertisementInput>({
    position,
    imageUrl: initialValue.imageUrl ?? '',
    publicId: initialValue.publicId ?? '',
    targetUrl: initialValue.targetUrl ?? '',
    isActive: initialValue.isActive ?? true,
    displayOrder: initialValue.displayOrder ?? 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm({
      position,
      imageUrl: initialValue.imageUrl ?? '',
      publicId: initialValue.publicId ?? '',
      targetUrl: initialValue.targetUrl ?? '',
      isActive: initialValue.isActive ?? true,
      displayOrder: initialValue.displayOrder ?? 0,
    });
  }, [
    initialValue.displayOrder,
    initialValue.imageUrl,
    initialValue.isActive,
    initialValue.publicId,
    initialValue.targetUrl,
    position,
  ]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadImage(file);
      setForm((current) => ({
        ...current,
        imageUrl: result.imageUrl,
        publicId: result.publicId,
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Image upload failed'));
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.imageUrl) {
      toast.error('Please upload a banner image before saving');
      return;
    }

    setIsSaving(true);

    try {
      await onSave({
        ...form,
        targetUrl: form.targetUrl?.trim() ?? '',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {mode === 'create' ? 'New Advertisement' : 'Edit Advertisement'}
              </h3>
              <p className="text-sm text-gray-500">{recommendedSize}</p>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                form.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {form.isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              {form.isActive ? 'Active' : 'Hidden'}
            </span>
          </div>

          <div
            className={`group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 ${previewHeightClassName}`}
          >
            {form.imageUrl ? (
              <img src={form.imageUrl} alt="Advertisement preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
                <ImageIcon className="h-10 w-10" />
                <p className="text-sm font-medium">Upload an ad image</p>
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm">
                <Upload className="h-4 w-4" />
                {isUploading ? 'Uploading...' : form.imageUrl ? 'Replace Image' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-gray-700">Target URL</span>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <LinkIcon className="h-4 w-4" />
              </div>
              <input
                type="url"
                value={form.targetUrl ?? ''}
                onChange={(event) => setForm((current) => ({ ...current, targetUrl: event.target.value }))}
                placeholder="https://example.com"
                className="block w-full rounded-xl border border-gray-300 p-3 pl-10 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700">Display Order</span>
              <input
                type="number"
                min={0}
                value={form.displayOrder}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    displayOrder: Number(event.target.value) || 0,
                  }))
                }
                className="block w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              Show this advertisement
            </label>
          </div>

          {form.targetUrl ? (
            <a
              href={form.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Preview target link
            </a>
          ) : null}

          <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isUploading}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : mode === 'create' ? 'Create Ad' : 'Save Changes'}
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              {mode === 'create' ? 'Remove Draft' : 'Delete Ad'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
