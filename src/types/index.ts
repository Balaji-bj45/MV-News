export type NewsCategory = 'india' | 'tamilnadu' | 'candidate';
export type LanguageCode = 'en' | 'ta';
export type AdminRole = 'admin' | 'editor';

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: Pagination;
}

export interface News {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  source: string;
  sourceUrl?: string;
  category: NewsCategory;
  tags: string[];
  isManual: boolean;
  isFeatured: boolean;
  viewCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidatePromise {
  title: string;
  description: string;
}

export interface CandidateTimelineEvent {
  date: string;
  event: string;
}

export interface CandidateSocialLinks {
  instagram?: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;
  whatsapp?: string;
}

export interface Candidate {
  _id: string;
  name: string;
  nameInTamil: string;
  party: string;
  constituency: string;
  photoUrl?: string;
  bio?: string;
  bioInTamil?: string;
  promises: CandidatePromise[];
  timeline: CandidateTimelineEvent[];
  socialLinks: CandidateSocialLinks;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  _id: string;
  youtubeId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  publishedAt: string;
  tags: string[];
  isFeatureInterview: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}

export interface AuthUser {
  id: string;
  role: AdminRole;
  name?: string;
  email?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData extends AuthTokens {
  user: AuthUser;
}

export interface NewsQueryParams {
  category?: NewsCategory;
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
}

export interface NewsInput {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  source: string;
  sourceUrl: string;
  category: NewsCategory;
  tags: string[];
  isFeatured: boolean;
  publishedAt: string;
}

export interface CandidateInput {
  name: string;
  nameInTamil: string;
  party: string;
  constituency: string;
  photoUrl: string;
  bio: string;
  bioInTamil: string;
  promises: CandidatePromise[];
  timeline: CandidateTimelineEvent[];
  socialLinks: CandidateSocialLinks;
  isActive: boolean;
}

export interface VideoInput {
  youtubeId: string;
  title: string;
  description: string;
  tags: string[];
  isFeatureInterview: boolean;
  publishedAt: string;
}

export interface UploadResult {
  imageUrl: string;
  publicId: string;
}

export interface JwtPayload {
  id: string;
  role: AdminRole;
  iat?: number;
  exp?: number;
}
