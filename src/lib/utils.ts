import type {
  Candidate,
  CandidateInput,
  CandidatePromise,
  CandidateTimelineEvent,
  LanguageCode,
  NewsCategory,
  NewsInput,
  Pagination,
  VideoInput,
} from '../types';

export const defaultPagination: Pagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

export const categoryOptions: Array<{ value: NewsCategory; labelKey: string }> = [
  { value: 'india', labelKey: 'categories.india' },
  { value: 'tamilnadu', labelKey: 'categories.tamilnadu' },
  { value: 'candidate', labelKey: 'categories.candidate' },
  { value: 'mvnews', labelKey: 'categories.mvnews' },
];

export const homeCategoryTabs: Array<{ value: 'all' | NewsCategory; labelKey: string }> = [
  { value: 'all', labelKey: 'categories.all' },
  ...categoryOptions,
];

export const formatDate = (value?: string | Date, language: LanguageCode = 'en') => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat(language === 'ta' ? 'ta-IN' : 'en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

export const formatDateTime = (value?: string | Date, language: LanguageCode = 'en') => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat(language === 'ta' ? 'ta-IN' : 'en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

export const parseTags = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

export const stringifyTags = (tags: string[]) => tags.join(', ');

export const stripHtml = (value?: string) => {
  if (!value) {
    return '';
  }

  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

export const truncate = (value: string, limit: number) => {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit).trim()}...`;
};

export const getEmbeddedYoutubeUrl = (youtubeId: string) =>
  `https://www.youtube.com/embed/${youtubeId}`;

export const buildShareUrl = (platform: 'whatsapp' | 'twitter' | 'facebook', url: string, text: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  if (platform === 'whatsapp') {
    return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  }

  if (platform === 'twitter') {
    return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  }

  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
};

export const createEmptyNewsForm = (): NewsInput => ({
  title: '',
  description: '',
  content: '',
  imageUrl: '',
  source: 'Admin',
  sourceUrl: '',
  category: 'india',
  tags: [],
  isFeatured: false,
  publishedAt: new Date().toISOString(),
});

export const createEmptyCandidatePromise = (): CandidatePromise => ({
  title: '',
  description: '',
});

export const createEmptyTimelineEvent = (): CandidateTimelineEvent => ({
  date: new Date().toISOString().slice(0, 10),
  event: '',
});

export const createEmptyCandidateForm = (): CandidateInput => ({
  name: '',
  nameInTamil: '',
  party: '',
  constituency: '',
  photoUrl: '',
  bio: '',
  bioInTamil: '',
  promises: [createEmptyCandidatePromise()],
  timeline: [createEmptyTimelineEvent()],
  socialLinks: {},
  isActive: true,
});

export const createEmptyVideoForm = (): VideoInput => ({
  youtubeId: '',
  title: '',
  description: '',
  tags: [],
  isFeatureInterview: false,
  publishedAt: new Date().toISOString(),
});

export const toNewsForm = (news: {
  title: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  source: string;
  sourceUrl?: string;
  category: NewsCategory;
  tags: string[];
  isFeatured: boolean;
  publishedAt: string;
}): NewsInput => ({
  title: news.title,
  description: news.description ?? '',
  content: news.content ?? '',
  imageUrl: news.imageUrl ?? '',
  source: news.source,
  sourceUrl: news.sourceUrl ?? '',
  category: news.category,
  tags: news.tags,
  isFeatured: news.isFeatured,
  publishedAt: news.publishedAt,
});

export const toCandidateForm = (candidate: Candidate): CandidateInput => ({
  name: candidate.name,
  nameInTamil: candidate.nameInTamil,
  party: candidate.party,
  constituency: candidate.constituency,
  photoUrl: candidate.photoUrl ?? '',
  bio: candidate.bio ?? '',
  bioInTamil: candidate.bioInTamil ?? '',
  promises: candidate.promises.length ? candidate.promises : [createEmptyCandidatePromise()],
  timeline: candidate.timeline.length
    ? candidate.timeline.map((item) => ({
        date: item.date ? new Date(item.date).toISOString().slice(0, 10) : '',
        event: item.event,
      }))
    : [createEmptyTimelineEvent()],
  socialLinks: candidate.socialLinks ?? {},
  isActive: candidate.isActive,
});

export const toVideoForm = (video: {
  youtubeId: string;
  title: string;
  description?: string;
  tags: string[];
  isFeatureInterview: boolean;
  publishedAt: string;
}): VideoInput => ({
  youtubeId: video.youtubeId,
  title: video.title,
  description: video.description ?? '',
  tags: video.tags,
  isFeatureInterview: video.isFeatureInterview,
  publishedAt: video.publishedAt,
});

export const getCandidateDisplayName = (candidate: Candidate, language: LanguageCode) =>
  language === 'ta' ? candidate.nameInTamil : candidate.name;

export const getCandidateBio = (candidate: Candidate, language: LanguageCode) =>
  language === 'ta' ? candidate.bioInTamil || candidate.bio || '' : candidate.bio || candidate.bioInTamil || '';
