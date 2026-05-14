import { useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ImagePlus, Newspaper, ShieldUser, Trash2, Video } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminTopbar, EmptyState, ErrorState, PageLoader, Seo, VideoBadge, pageShell } from '../components/ui';
import {
  createEmptyCandidateForm,
  createEmptyCandidatePromise,
  createEmptyNewsForm,
  createEmptyTimelineEvent,
  createEmptyVideoForm,
  formatDate,
  parseTags,
  stringifyTags,
  toCandidateForm,
  toNewsForm,
  toVideoForm,
} from '../lib/utils';
import {
  useCreateCandidateMutation,
  useDeleteCandidateMutation,
  useGetCandidatesQuery,
  useUpdateCandidateMutation,
} from '../services/candidateApi';
import {
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useGetNewsQuery,
  useToggleFeatureNewsMutation,
  useUpdateNewsMutation,
} from '../services/newsApi';
import {
  useCreateVideoMutation,
  useDeleteVideoMutation,
  useGetVideosQuery,
  useUpdateVideoMutation,
} from '../services/videoApi';
import { uploadImage } from '../services/upload';
import type {
  Candidate,
  CandidateInput,
  CandidateSocialLinks,
  News,
  NewsCategory,
  NewsInput,
  Video as VideoType,
  VideoInput,
} from '../types';

type DashboardSection = 'news' | 'candidates' | 'videos' | 'mvnews';

interface NewsEditorState extends Omit<NewsInput, 'tags'> {
  tagsText: string;
}

interface VideoEditorState extends Omit<VideoInput, 'tags'> {
  tagsText: string;
}

const toLocalDateTimeValue = (value: string) => {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().slice(0, 16);
};

const fromLocalDateTimeValue = (value: string) => {
  if (!value) {
    return new Date().toISOString();
  }

  return new Date(value).toISOString();
};

const createNewsEditorState = (): NewsEditorState => {
  const form = createEmptyNewsForm();
  return {
    ...form,
    publishedAt: toLocalDateTimeValue(form.publishedAt),
    tagsText: '',
  };
};

const createMvNewsEditorState = (): NewsEditorState => {
  const form = createEmptyNewsForm();
  return {
    ...form,
    category: 'mvnews',
    publishedAt: toLocalDateTimeValue(form.publishedAt),
    tagsText: '',
  };
};

const createVideoEditorState = (): VideoEditorState => {
  const form = createEmptyVideoForm();
  return {
    ...form,
    publishedAt: toLocalDateTimeValue(form.publishedAt),
    tagsText: '',
  };
};

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: unknown }).data;

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data === 'object' && data !== null && 'message' in data) {
      return String((data as { message?: string }).message ?? fallback);
    }
  }

  return fallback;
};

function DashboardPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-black text-stone-900">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm leading-6 text-stone-600">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function SidebarButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[1.5rem] px-4 py-4 text-left text-sm font-semibold ${
        active ? 'bg-red-700 text-white shadow-lg shadow-red-700/20' : 'bg-white text-stone-700 hover:bg-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-white disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm font-semibold text-stone-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-white disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [uploadingImage, setUploadingImage] = useState(false);

  const sectionParam = searchParams.get('section');
  const activeSection: DashboardSection =
    sectionParam === 'candidates' || sectionParam === 'videos' || sectionParam === 'mvnews' ? sectionParam : 'news';

  const [newsPage, setNewsPage] = useState(1);
  const [mvNewsPage, setMvNewsPage] = useState(1);
  const [newsCategory, setNewsCategory] = useState<'all' | NewsCategory>('all');
  const [videoPage, setVideoPage] = useState(1);

  const newsResponse = useGetNewsQuery({ 
    page: newsPage, 
    limit: 10, 
    category: newsCategory !== 'all' ? newsCategory : undefined 
  });
  const mvNewsResponse = useGetNewsQuery({
    page: mvNewsPage,
    limit: 10,
    category: 'mvnews',
  });
  const candidateResponse = useGetCandidatesQuery();
  const videosResponse = useGetVideosQuery({ page: videoPage, limit: 10, source: 'manual' });

  const [createNews, createNewsStatus] = useCreateNewsMutation();
  const [updateNews, updateNewsStatus] = useUpdateNewsMutation();
  const [deleteNews] = useDeleteNewsMutation();
  const [toggleFeatureNews] = useToggleFeatureNewsMutation();

  const [createCandidate] = useCreateCandidateMutation();
  const [updateCandidate] = useUpdateCandidateMutation();
  const [deleteCandidate] = useDeleteCandidateMutation();

  const [createVideo] = useCreateVideoMutation();
  const [updateVideo] = useUpdateVideoMutation();
  const [deleteVideo] = useDeleteVideoMutation();

  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [editingMvNews, setEditingMvNews] = useState<News | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);

  const [newsForm, setNewsForm] = useState<NewsEditorState>(createNewsEditorState);
  const [mvNewsForm, setMvNewsForm] = useState<NewsEditorState>(createMvNewsEditorState);
  const [candidateForm, setCandidateForm] = useState<CandidateInput>(createEmptyCandidateForm);
  const [videoForm, setVideoForm] = useState<VideoEditorState>(createVideoEditorState);

  const setSection = (next: DashboardSection) => {
    setSearchParams({ section: next });
  };

  const resetNewsEditor = () => {
    setEditingNews(null);
    setNewsForm(createNewsEditorState());
  };

  const resetMvNewsEditor = () => {
    setEditingMvNews(null);
    setMvNewsForm(createMvNewsEditorState());
  };

  const resetCandidateEditor = () => {
    setEditingCandidate(null);
    setCandidateForm(createEmptyCandidateForm());
  };

  const resetVideoEditor = () => {
    setEditingVideo(null);
    setVideoForm(createVideoEditorState());
  };

  const handleUploadImage = async (file?: File | null) => {
    if (!file) {
      return;
    }

    setUploadingImage(true);

    try {
      const result = await uploadImage(file);
      setNewsForm((current) => ({ ...current, imageUrl: result.imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Image upload failed'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleNewsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: NewsInput = {
      ...newsForm,
      tags: parseTags(newsForm.tagsText),
      publishedAt: fromLocalDateTimeValue(newsForm.publishedAt),
    };

    try {
      if (editingNews) {
        await updateNews({ id: editingNews._id, payload }).unwrap();
        toast.success('News updated');
      } else {
        await createNews(payload).unwrap();
        toast.success('News created');
      }

      resetNewsEditor();
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Unable to save this story'));
    }
  };

  const handleMvNewsUploadImage = async (file?: File | null) => {
    if (!file) {
      return;
    }

    setUploadingImage(true);

    try {
      const result = await uploadImage(file);
      setMvNewsForm((current) => ({ ...current, imageUrl: result.imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Image upload failed'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMvNewsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: NewsInput = {
      ...mvNewsForm,
      category: 'mvnews',
      tags: parseTags(mvNewsForm.tagsText),
      publishedAt: fromLocalDateTimeValue(mvNewsForm.publishedAt),
    };

    try {
      if (editingMvNews) {
        await updateNews({ id: editingMvNews._id, payload }).unwrap();
        toast.success('MV News updated');
      } else {
        await createNews(payload).unwrap();
        toast.success('MV News created');
      }

      resetMvNewsEditor();
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Unable to save MV news'));
    }
  };

  const handleCandidateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CandidateInput = {
      ...candidateForm,
      promises: candidateForm.promises.filter((item) => item.title.trim() && item.description.trim()),
      timeline: candidateForm.timeline
        .filter((item) => item.event.trim())
        .map((item) => ({
          date: new Date(item.date).toISOString(),
          event: item.event,
        })),
      socialLinks: Object.entries(candidateForm.socialLinks).reduce<CandidateSocialLinks>((acc, [key, value]) => {
        if (value?.trim()) {
          acc[key as keyof CandidateSocialLinks] = value.trim();
        }
        return acc;
      }, {}),
    };

    try {
      if (editingCandidate) {
        await updateCandidate({ id: editingCandidate._id, payload }).unwrap();
        toast.success('Candidate updated');
      } else {
        await createCandidate(payload).unwrap();
        toast.success('Candidate created');
      }

      resetCandidateEditor();
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Unable to save candidate'));
    }
  };

  const handleVideoSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: VideoInput = {
      ...videoForm,
      tags: parseTags(videoForm.tagsText),
      publishedAt: fromLocalDateTimeValue(videoForm.publishedAt),
    };

    try {
      if (editingVideo) {
        await updateVideo({ id: editingVideo._id, payload }).unwrap();
        toast.success('Video updated');
      } else {
        await createVideo(payload).unwrap();
        toast.success('Video added');
      }

      resetVideoEditor();
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Unable to save video'));
    }
  };

  const startEditNews = (item: News) => {
    setEditingNews(item);
    const form = toNewsForm(item);
    setNewsForm({
      ...form,
      publishedAt: toLocalDateTimeValue(form.publishedAt),
      tagsText: stringifyTags(form.tags),
    });
  };

  const startEditMvNews = (item: News) => {
    setEditingMvNews(item);
    const form = toNewsForm(item);
    setMvNewsForm({
      ...form,
      category: 'mvnews',
      publishedAt: toLocalDateTimeValue(form.publishedAt),
      tagsText: stringifyTags(form.tags),
    });
  };

  const startEditCandidate = (item: Candidate) => {
    setEditingCandidate(item);
    setCandidateForm(toCandidateForm(item));
  };

  const startEditVideo = (item: VideoType) => {
    setEditingVideo(item);
    const form = toVideoForm(item);
    setVideoForm({
      ...form,
      publishedAt: toLocalDateTimeValue(form.publishedAt),
      tagsText: stringifyTags(form.tags),
    });
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm('Delete this story?')) {
      return;
    }

    try {
      await deleteNews(id).unwrap();
      toast.success('News deleted');
      if (editingNews?._id === id) {
        resetNewsEditor();
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Unable to delete story'));
    }
  };

  const handleDeleteMvNews = async (id: string) => {
    if (!window.confirm('Delete this MV News?')) {
      return;
    }

    try {
      await deleteNews(id).unwrap();
      toast.success('MV News deleted');
      if (editingMvNews?._id === id) {
        resetMvNewsEditor();
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Unable to delete MV News'));
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    if (!window.confirm('Delete this candidate?')) {
      return;
    }

    try {
      await deleteCandidate(id).unwrap();
      toast.success('Candidate deleted');
      if (editingCandidate?._id === id) {
        resetCandidateEditor();
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Unable to delete candidate'));
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm('Delete this video?')) {
      return;
    }

    try {
      await deleteVideo(id).unwrap();
      toast.success('Video deleted');
      if (editingVideo?._id === id) {
        resetVideoEditor();
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Unable to delete video'));
    }
  };

  const handleToggleFeature = async (item: News) => {
    try {
      await toggleFeatureNews(item._id).unwrap();
      toast.success(item.isFeatured ? 'Feature removed' : 'Story featured');
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Unable to update feature status'));
    }
  };

  return (
    <>
      <Seo title="Admin dashboard | MV News" description="Manage stories, candidates, and videos from the editorial dashboard." />

      <div className={`min-h-screen bg-white/70 py-8 ${i18n.language === 'ta' ? 'font-tamil' : ''}`}>
        <div className={`${pageShell} space-y-6`}>
          <AdminTopbar />

          <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="space-y-3 rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm">
              <SidebarButton
                label={t('admin.news')}
                icon={<Newspaper className="h-5 w-5" />}
                active={activeSection === 'news'}
                onClick={() => setSection('news')}
              />
              <SidebarButton
                label={t('admin.candidates')}
                icon={<ShieldUser className="h-5 w-5" />}
                active={activeSection === 'candidates'}
                onClick={() => setSection('candidates')}
              />
              <SidebarButton
                label={t('admin.video')}
                icon={<Video className="h-5 w-5" />}
                active={activeSection === 'videos'}
                onClick={() => setSection('videos')}
              />
              <SidebarButton
                label={t('admin.mvnews')}
                icon={<Newspaper className="h-5 w-5 text-red-600" />}
                active={activeSection === 'mvnews'}
                onClick={() => setSection('mvnews')}
              />
            </aside>

            <div className="space-y-6">
              <DashboardPanel title={activeSection === 'mvnews' ? 'Add or edit MV News' : activeSection === 'candidates' ? 'Add or edit candidate' : activeSection === 'videos' ? 'Add or edit video' : 'Add or edit news'} subtitle={t('admin.imageHint')}>
                {activeSection === 'news' ? (
                  <form className="grid gap-5" onSubmit={handleNewsSubmit}>
                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Title</span>
                        <input
                          value={newsForm.title}
                          onChange={(event) => setNewsForm((current) => ({ ...current, title: event.target.value }))}
                          required
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Category</span>
                        <select
                          value={newsForm.category}
                          onChange={(event) =>
                            setNewsForm((current) => ({
                              ...current,
                              category: event.target.value as NewsInput['category'],
                            }))
                          }
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        >
                          <option value="india">India</option>
                          <option value="tamilnadu">Tamil Nadu</option>
                          <option value="candidate">Candidate</option>
                        </select>
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Source</span>
                        <input
                          value={newsForm.source}
                          onChange={(event) => setNewsForm((current) => ({ ...current, source: event.target.value }))}
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Published at</span>
                        <input
                          type="datetime-local"
                          value={newsForm.publishedAt}
                          onChange={(event) => setNewsForm((current) => ({ ...current, publishedAt: event.target.value }))}
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                    </div>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-stone-700">Description</span>
                      <textarea
                        value={newsForm.description}
                        onChange={(event) => setNewsForm((current) => ({ ...current, description: event.target.value }))}
                        rows={4}
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-stone-700">Content</span>
                      <ReactQuill value={newsForm.content} onChange={(value) => setNewsForm((current) => ({ ...current, content: value }))} />
                    </label>

                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Image URL</span>
                        <input
                          value={newsForm.imageUrl}
                          onChange={(event) => setNewsForm((current) => ({ ...current, imageUrl: event.target.value }))}
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Source URL</span>
                        <input
                          value={newsForm.sourceUrl}
                          onChange={(event) => setNewsForm((current) => ({ ...current, sourceUrl: event.target.value }))}
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Tags</span>
                        <input
                          value={newsForm.tagsText}
                          onChange={(event) => setNewsForm((current) => ({ ...current, tagsText: event.target.value }))}
                          placeholder="election, speech, analysis"
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <div className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Upload image</span>
                        <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:border-red-300 hover:text-red-700">
                          <ImagePlus className="h-4 w-4" />
                          {uploadingImage ? 'Uploading...' : t('common.upload')}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => void handleUploadImage(event.target.files?.[0])}
                          />
                        </label>
                      </div>
                    </div>

                    <label className="flex items-center gap-3 text-sm font-semibold text-stone-700">
                      <input
                        type="checkbox"
                        checked={newsForm.isFeatured}
                        onChange={(event) => setNewsForm((current) => ({ ...current, isFeatured: event.target.checked }))}
                        className="h-4 w-4 rounded border-stone-300"
                      />
                      Mark as featured
                    </label>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={createNewsStatus.isLoading || updateNewsStatus.isLoading}
                        className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        {editingNews ? t('common.update') : t('common.save')}
                      </button>
                      <button
                        type="button"
                        onClick={resetNewsEditor}
                        className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700"
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  </form>
                ) : activeSection === 'candidates' ? (
                  <form className="grid gap-5" onSubmit={handleCandidateSubmit}>
                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Name</span>
                        <input
                          value={candidateForm.name}
                          onChange={(event) => setCandidateForm((current) => ({ ...current, name: event.target.value }))}
                          required
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Name in Tamil</span>
                        <input
                          value={candidateForm.nameInTamil}
                          onChange={(event) => setCandidateForm((current) => ({ ...current, nameInTamil: event.target.value }))}
                          required
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Party</span>
                        <input
                          value={candidateForm.party}
                          onChange={(event) => setCandidateForm((current) => ({ ...current, party: event.target.value }))}
                          required
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Constituency</span>
                        <input
                          value={candidateForm.constituency}
                          onChange={(event) =>
                            setCandidateForm((current) => ({ ...current, constituency: event.target.value }))
                          }
                          required
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                    </div>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-stone-700">Photo URL</span>
                      <input
                        value={candidateForm.photoUrl}
                        onChange={(event) => setCandidateForm((current) => ({ ...current, photoUrl: event.target.value }))}
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                      />
                    </label>

                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Bio</span>
                        <textarea
                          value={candidateForm.bio}
                          onChange={(event) => setCandidateForm((current) => ({ ...current, bio: event.target.value }))}
                          rows={5}
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Bio in Tamil</span>
                        <textarea
                          value={candidateForm.bioInTamil}
                          onChange={(event) => setCandidateForm((current) => ({ ...current, bioInTamil: event.target.value }))}
                          rows={5}
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                    </div>

                    <div className="grid gap-5 xl:grid-cols-2">
                      <div className="space-y-4 rounded-[1.5rem] border border-stone-200 bg-white p-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-semibold text-stone-900">Promises</h3>
                          <button
                            type="button"
                            onClick={() =>
                              setCandidateForm((current) => ({
                                ...current,
                                promises: [...current.promises, createEmptyCandidatePromise()],
                              }))
                            }
                            className="rounded-full border border-stone-300 px-3 py-1 text-xs font-semibold text-stone-700"
                          >
                            Add promise
                          </button>
                        </div>
                        {candidateForm.promises.map((promise, index) => (
                          <div key={`${promise.title}-${index}`} className="space-y-3 rounded-2xl bg-white p-4">
                            <input
                              value={promise.title}
                              onChange={(event) =>
                                setCandidateForm((current) => ({
                                  ...current,
                                  promises: current.promises.map((item, itemIndex) =>
                                    itemIndex === index ? { ...item, title: event.target.value } : item,
                                  ),
                                }))
                              }
                              placeholder="Promise title"
                              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                            />
                            <textarea
                              value={promise.description}
                              onChange={(event) =>
                                setCandidateForm((current) => ({
                                  ...current,
                                  promises: current.promises.map((item, itemIndex) =>
                                    itemIndex === index ? { ...item, description: event.target.value } : item,
                                  ),
                                }))
                              }
                              rows={3}
                              placeholder="Promise description"
                              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                            />
                            {candidateForm.promises.length > 1 ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setCandidateForm((current) => ({
                                    ...current,
                                    promises: current.promises.filter((_, itemIndex) => itemIndex !== index),
                                  }))
                                }
                                className="inline-flex items-center gap-2 text-sm font-semibold text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove
                              </button>
                            ) : null}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4 rounded-[1.5rem] border border-stone-200 bg-white p-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-semibold text-stone-900">Timeline</h3>
                          <button
                            type="button"
                            onClick={() =>
                              setCandidateForm((current) => ({
                                ...current,
                                timeline: [...current.timeline, createEmptyTimelineEvent()],
                              }))
                            }
                            className="rounded-full border border-stone-300 px-3 py-1 text-xs font-semibold text-stone-700"
                          >
                            Add event
                          </button>
                        </div>
                        {candidateForm.timeline.map((timelineItem, index) => (
                          <div key={`${timelineItem.date}-${index}`} className="space-y-3 rounded-2xl bg-white p-4">
                            <input
                              type="date"
                              value={timelineItem.date.slice(0, 10)}
                              onChange={(event) =>
                                setCandidateForm((current) => ({
                                  ...current,
                                  timeline: current.timeline.map((item, itemIndex) =>
                                    itemIndex === index ? { ...item, date: event.target.value } : item,
                                  ),
                                }))
                              }
                              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                            />
                            <textarea
                              value={timelineItem.event}
                              onChange={(event) =>
                                setCandidateForm((current) => ({
                                  ...current,
                                  timeline: current.timeline.map((item, itemIndex) =>
                                    itemIndex === index ? { ...item, event: event.target.value } : item,
                                  ),
                                }))
                              }
                              rows={3}
                              placeholder="Event details"
                              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                            />
                            {candidateForm.timeline.length > 1 ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setCandidateForm((current) => ({
                                    ...current,
                                    timeline: current.timeline.filter((_, itemIndex) => itemIndex !== index),
                                  }))
                                }
                                className="inline-flex items-center gap-2 text-sm font-semibold text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove
                              </button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                      {(['instagram', 'twitter', 'youtube', 'facebook', 'whatsapp'] as const).map((socialKey) => (
                        <label key={socialKey} className="space-y-2">
                          <span className="text-sm font-semibold capitalize text-stone-700">{socialKey}</span>
                          <input
                            value={candidateForm.socialLinks[socialKey] ?? ''}
                            onChange={(event) =>
                              setCandidateForm((current) => ({
                                ...current,
                                socialLinks: {
                                  ...current.socialLinks,
                                  [socialKey]: event.target.value,
                                },
                              }))
                            }
                            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                          />
                        </label>
                      ))}
                    </div>

                    <label className="flex items-center gap-3 text-sm font-semibold text-stone-700">
                      <input
                        type="checkbox"
                        checked={candidateForm.isActive}
                        onChange={(event) =>
                          setCandidateForm((current) => ({ ...current, isActive: event.target.checked }))
                        }
                        className="h-4 w-4 rounded border-stone-300"
                      />
                      Active candidate
                    </label>

                    <div className="flex flex-wrap gap-3">
                      <button type="submit" className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700">
                        {editingCandidate ? t('common.update') : t('common.save')}
                      </button>
                      <button
                        type="button"
                        onClick={resetCandidateEditor}
                        className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700"
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  </form>
                ) : activeSection === 'videos' ? (
                  <form className="grid gap-5" onSubmit={handleVideoSubmit}>
                    <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-stone-700">
                      Latest videos from the MVNewsBot YouTube channel appear on the website automatically.
                      Use this form only for backup or alternative YouTube news videos that should also appear in the featured video section.
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">YouTube video URL or ID</span>
                        <input
                          value={videoForm.youtubeId}
                          onChange={(event) => setVideoForm((current) => ({ ...current, youtubeId: event.target.value }))}
                          required
                          placeholder="https://www.youtube.com/watch?v=... or the 11-character ID"
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Title</span>
                        <input
                          value={videoForm.title}
                          onChange={(event) => setVideoForm((current) => ({ ...current, title: event.target.value }))}
                          required
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Published at</span>
                        <input
                          type="datetime-local"
                          value={videoForm.publishedAt}
                          onChange={(event) => setVideoForm((current) => ({ ...current, publishedAt: event.target.value }))}
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Tags</span>
                        <input
                          value={videoForm.tagsText}
                          onChange={(event) => setVideoForm((current) => ({ ...current, tagsText: event.target.value }))}
                          placeholder="interview, manifesto"
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                    </div>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-stone-700">Description</span>
                      <textarea
                        value={videoForm.description}
                        onChange={(event) => setVideoForm((current) => ({ ...current, description: event.target.value }))}
                        rows={4}
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                      />
                    </label>

                    <label className="flex items-center gap-3 text-sm font-semibold text-stone-700">
                      <input
                        type="checkbox"
                        checked={videoForm.isFeatureInterview}
                        onChange={(event) =>
                          setVideoForm((current) => ({ ...current, isFeatureInterview: event.target.checked }))
                        }
                        className="h-4 w-4 rounded border-stone-300"
                      />
                      Feature interview
                    </label>

                    <div className="flex flex-wrap gap-3">
                      <button type="submit" className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700">
                        {editingVideo ? t('common.update') : t('common.save')}
                      </button>
                      <button
                        type="button"
                        onClick={resetVideoEditor}
                        className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700"
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  </form>
                ) : activeSection === 'mvnews' ? (
                  <form className="grid gap-5" onSubmit={handleMvNewsSubmit}>
                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Title</span>
                        <input
                          value={mvNewsForm.title}
                          onChange={(event) => setMvNewsForm((current) => ({ ...current, title: event.target.value }))}
                          required
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Category</span>
                        <input
                          value="MV News"
                          disabled
                          className="w-full rounded-2xl border border-stone-300 bg-stone-100 px-4 py-3 text-sm text-stone-500 cursor-not-allowed"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Source</span>
                        <input
                          value={mvNewsForm.source}
                          onChange={(event) => setMvNewsForm((current) => ({ ...current, source: event.target.value }))}
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Published at</span>
                        <input
                          type="datetime-local"
                          value={mvNewsForm.publishedAt}
                          onChange={(event) => setMvNewsForm((current) => ({ ...current, publishedAt: event.target.value }))}
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                    </div>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-stone-700">Description</span>
                      <textarea
                        value={mvNewsForm.description}
                        onChange={(event) => setMvNewsForm((current) => ({ ...current, description: event.target.value }))}
                        rows={3}
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-stone-700">Content (Simple input instead of Rich Text)</span>
                      <textarea
                        value={mvNewsForm.content}
                        onChange={(event) => setMvNewsForm((current) => ({ ...current, content: event.target.value }))}
                        rows={8}
                        placeholder="Enter plain text or HTML content formatted responsive for frontend..."
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-mono"
                      />
                    </label>

                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Image URL</span>
                        <input
                          value={mvNewsForm.imageUrl}
                          onChange={(event) => setMvNewsForm((current) => ({ ...current, imageUrl: event.target.value }))}
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Source URL</span>
                        <input
                          value={mvNewsForm.sourceUrl}
                          onChange={(event) => setMvNewsForm((current) => ({ ...current, sourceUrl: event.target.value }))}
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Tags</span>
                        <input
                          value={mvNewsForm.tagsText}
                          onChange={(event) => setMvNewsForm((current) => ({ ...current, tagsText: event.target.value }))}
                          placeholder="mvnews, exclusive, coverage"
                          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
                        />
                      </label>
                      <div className="space-y-2">
                        <span className="text-sm font-semibold text-stone-700">Upload image</span>
                        <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:border-red-300 hover:text-red-700">
                          <ImagePlus className="h-4 w-4" />
                          {uploadingImage ? 'Uploading...' : t('common.upload')}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => void handleMvNewsUploadImage(event.target.files?.[0])}
                          />
                        </label>
                      </div>
                    </div>

                    <label className="flex items-center gap-3 text-sm font-semibold text-stone-700">
                      <input
                        type="checkbox"
                        checked={mvNewsForm.isFeatured}
                        onChange={(event) => setMvNewsForm((current) => ({ ...current, isFeatured: event.target.checked }))}
                        className="h-4 w-4 rounded border-stone-300"
                      />
                      Mark as featured
                    </label>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={createNewsStatus.isLoading || updateNewsStatus.isLoading}
                        className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        {editingMvNews ? t('common.update') : t('common.save')}
                      </button>
                      <button
                        type="button"
                        onClick={resetMvNewsEditor}
                        className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700"
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  </form>
                ) : null}
              </DashboardPanel>

              <DashboardPanel title={activeSection === 'mvnews' ? 'MV News list' : activeSection === 'candidates' ? 'Candidate list' : activeSection === 'videos' ? 'Video list' : 'News list'}>
                {activeSection === 'news' ? (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-stone-200 pb-4">
                      <span className="text-sm font-semibold text-stone-700 whitespace-nowrap">Filter by Category:</span>
                      <select
                        value={newsCategory}
                        onChange={(e) => {
                          setNewsCategory(e.target.value as 'all' | NewsCategory);
                          setNewsPage(1);
                        }}
                        className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-red-500 w-full sm:w-auto"
                      >
                        <option value="all">All News</option>
                        <option value="tamilnadu">Tamil Nadu Political</option>
                        <option value="india">Indian Political</option>
                        <option value="candidate">Candidate Features</option>
                      </select>
                    </div>
                    {newsResponse.isLoading ? (
                      <PageLoader />
                    ) : newsResponse.isError ? (
                      <ErrorState message="Unable to load news for editing." />
                    ) : newsResponse.data?.items.length ? (
                      <div className="space-y-4">
                      {newsResponse.data.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex flex-col gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-5 xl:flex-row xl:items-center xl:justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-display text-2xl font-black text-stone-900">{item.title}</h3>
                              {item.isFeatured ? (
                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-red-700">
                                  Featured
                                </span>
                              ) : null}
                            </div>
                            <p className="text-sm text-stone-600">
                              {item.category} · {formatDate(item.publishedAt)}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => startEditNews(item)}
                              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleToggleFeature(item)}
                              className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700"
                            >
                              {item.isFeatured ? t('common.unfeature') : t('common.feature')}
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteNews(item._id)}
                              className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                            >
                              {t('common.delete')}
                            </button>
                          </div>
                        </div>
                      ))}
                      <PaginationControls 
                        currentPage={newsResponse.data.pagination.page} 
                        totalPages={newsResponse.data.pagination.totalPages} 
                        onPageChange={setNewsPage} 
                      />
                    </div>
                  ) : (
                    <EmptyState title="No stories" body="Create the first news item using the form above." />
                  )}
                  </div>
                ) : activeSection === 'candidates' ? (
                  candidateResponse.isLoading ? (
                    <PageLoader />
                  ) : candidateResponse.isError ? (
                    <ErrorState message="Unable to load candidates." />
                  ) : candidateResponse.data?.length ? (
                    <div className="space-y-4">
                      {candidateResponse.data.map((item) => (
                        <div
                          key={item._id}
                          className="flex flex-col gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-5 xl:flex-row xl:items-center xl:justify-between"
                        >
                          <div>
                            <h3 className="font-display text-2xl font-black text-stone-900">{item.name}</h3>
                            <p className="text-sm text-stone-600">
                              {item.party} · {item.constituency}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => startEditCandidate(item)}
                              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteCandidate(item._id)}
                              className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                            >
                              {t('common.delete')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState title="No candidates" body="Add the first candidate profile using the form above." />
                  )
                ) : activeSection === 'videos' ? (
                  videosResponse.isLoading ? (
                    <PageLoader />
                  ) : videosResponse.isError ? (
                    <ErrorState message="Unable to load videos." />
                  ) : videosResponse.data?.items.length ? (
                    <div className="space-y-4">
                      {videosResponse.data.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex flex-col gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-5 xl:flex-row xl:items-center xl:justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-display text-2xl font-black text-stone-900">{item.title}</h3>
                              <VideoBadge />
                            </div>
                            <p className="text-sm text-stone-600">{formatDate(item.publishedAt)}</p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => startEditVideo(item)}
                              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteVideo(item._id)}
                              className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                            >
                              {t('common.delete')}
                            </button>
                          </div>
                        </div>
                      ))}
                      <PaginationControls 
                        currentPage={videosResponse.data.pagination.page} 
                        totalPages={videosResponse.data.pagination.totalPages} 
                        onPageChange={setVideoPage} 
                      />
                    </div>
                  ) : (
                    <EmptyState title="No backup videos" body="Add an alternative YouTube news video using the form above." />
                  )
                ) : activeSection === 'mvnews' ? (
                  mvNewsResponse.isLoading ? (
                    <PageLoader />
                  ) : mvNewsResponse.isError ? (
                    <ErrorState message="Unable to load MV news." />
                  ) : mvNewsResponse.data?.items.length ? (
                    <div className="space-y-4">
                      {mvNewsResponse.data.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex flex-col gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-5 xl:flex-row xl:items-center xl:justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-display text-2xl font-black text-stone-900">{item.title}</h3>
                              {item.isFeatured ? (
                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-red-700">
                                  Featured
                                </span>
                              ) : null}
                            </div>
                            <p className="text-sm text-stone-600">
                              {item.category} · {formatDate(item.publishedAt)}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => startEditMvNews(item)}
                              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteMvNews(item._id)}
                              className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                            >
                              {t('common.delete')}
                            </button>
                          </div>
                        </div>
                      ))}
                      <PaginationControls 
                        currentPage={mvNewsResponse.data.pagination.page} 
                        totalPages={mvNewsResponse.data.pagination.totalPages} 
                        onPageChange={setMvNewsPage} 
                      />
                    </div>
                  ) : (
                    <EmptyState title="No MV News" body="Create the first MV News item using the form above." />
                  )
                ) : null}
              </DashboardPanel>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
