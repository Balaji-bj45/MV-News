import { useEffect, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  LogOut,
  Newspaper,
  PlayCircle,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { getAccessToken, getRefreshToken } from '../app/tokenManager';
import { useLogoutMutation, useRefreshMutation } from '../services/authApi';
import { buildShareUrl, formatDate, getCandidateBio, getCandidateDisplayName, stripHtml, truncate } from '../lib/utils';
import type { Candidate, LanguageCode, News, Pagination as PaginationShape } from '../types';

export const pageShell = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';

export function Seo({ title, description }: { title: string; description: string }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}

export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}




import { Navbar } from '../Loyout/Navbar';
import { Footer } from '../Loyout/Footer';

export function SiteLayout() {
  const { i18n } = useTranslation();

  return (
    <div className={i18n.language === 'ta' ? 'font-tamil' : undefined}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function PageLoader({ label, fullHeight = false }: { label?: string; fullHeight?: boolean }) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-center justify-center ${
        fullHeight ? 'min-h-[50vh]' : 'min-h-[12rem]'
      }`}
    >
      <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-white/85 px-5 py-3 text-sm font-medium text-stone-600 shadow-sm">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        {label ?? t('common.loading')}
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-8 text-red-800 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5" />
        <p className="text-sm leading-6">{message ?? 'Something went wrong while loading this section.'}</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white/70 px-6 py-10 text-center">
      <p className="font-display text-2xl font-bold text-stone-900">{title}</p>
      <p className="mt-3 text-sm leading-6 text-stone-600">{body}</p>
    </div>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-3">
      {eyebrow ? (
        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-red-700">
          <Sparkles className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
      ) : null}
      <h2 className="font-display text-3xl font-black text-stone-900 sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-3xl text-base leading-7 text-stone-600">{description}</p> : null}
    </div>
  );
}

export function NewsCard({ news, compact = false }: { news: News; compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const language = (i18n.language === 'ta' ? 'ta' : 'en') as LanguageCode;

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm shadow-stone-200/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-300/30">
      <Link to={`/news/${news.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-white">
          {news.imageUrl ? (
            <img
              src={news.imageUrl}
              alt={news.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-red-800 via-red-700 to-amber-500 text-white">
              <Newspaper className="h-12 w-12 opacity-80" />
            </div>
          )}
          {news.isFeatured ? (
            <span className="absolute left-4 top-4 rounded-full bg-red-700 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
              {t('home.heroLabel')}
            </span>
          ) : null}
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          <span>{news.category}</span>
          <span>{formatDate(news.publishedAt, language)}</span>
        </div>
        <div className="space-y-3">
          <Link to={`/news/${news.slug}`} className="block">
            <h3 className={`font-display font-black text-stone-900 ${compact ? 'text-xl' : 'text-2xl'}`}>
              {news.title}
            </h3>
          </Link>
          <p className="text-sm leading-6 text-stone-600">
            {truncate(stripHtml(news.description || news.content || ''), compact ? 110 : 145)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">{news.source}</span>
          <Link to={`/news/${news.slug}`} className="text-sm font-semibold text-stone-900 hover:text-red-700">
            {t('common.readMore')}
          </Link>
        </div>
      </div>
    </article>
  );
}



export function Pagination({
  pagination,
  onChange,
}: {
  pagination: PaginationShape;
  onChange: (page: number) => void;
}) {
  const { t } = useTranslation();

  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] border border-stone-200 bg-white px-5 py-4 shadow-sm">
      <button
        type="button"
        onClick={() => onChange(pagination.page - 1)}
        disabled={pagination.page <= 1}
        className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('common.previous')}
      </button>
      <p className="text-sm font-medium text-stone-600">
        {t('common.page')} {pagination.page} / {Math.max(pagination.totalPages, 1)}
      </p>
      <button
        type="button"
        onClick={() => onChange(pagination.page + 1)}
        disabled={pagination.page >= pagination.totalPages}
        className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t('common.next')}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export function CandidateSpotlightCard({ candidate }: { candidate: Candidate }) {
  const { i18n, t } = useTranslation();
  const language = (i18n.language === 'ta' ? 'ta' : 'en') as LanguageCode;

  return (
    <aside className="glass-panel overflow-hidden rounded-[2rem] border border-stone-200 shadow-sm">
      <div className="aspect-[4/3] bg-white">
        {candidate.photoUrl ? (
          <img src={candidate.photoUrl} alt={candidate.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-red-700 to-stone-900 text-white">
            <Shield className="h-10 w-10 opacity-80" />
          </div>
        )}
      </div>
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-700">{t('common.candidateSpotlight')}</p>
          <h3 className="font-display text-2xl font-black text-stone-900">
            {getCandidateDisplayName(candidate, language)}
          </h3>
          <p className="text-sm font-semibold text-stone-500">
            {candidate.party} · {candidate.constituency}
          </p>
        </div>
        <p className="text-sm leading-6 text-stone-600">{truncate(getCandidateBio(candidate, language), 200)}</p>
        <Link
          to={`/candidate/${candidate._id}`}
          className="inline-flex rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          {t('common.readMore')}
        </Link>
      </div>
    </aside>
  );
}

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const { t } = useTranslation();
  const items: Array<{ key: 'whatsapp' | 'twitter' | 'facebook'; label: string }> = [
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'twitter', label: 'Twitter' },
    { key: 'facebook', label: 'Facebook' },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-stone-700">{t('article.share')}</p>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <a
            key={item.key}
            href={buildShareUrl(item.key, url, title)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:border-red-300 hover:text-red-700"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const authStatus = useAppSelector((state) => state.auth.status);
  const [refreshSession, { isLoading }] = useRefreshMutation();
  const hasAccessToken = Boolean(getAccessToken());
  const hasRefreshToken = Boolean(getRefreshToken());

  useEffect(() => {
    if (!hasAccessToken && hasRefreshToken) {
      void refreshSession();
    }
  }, [hasAccessToken, hasRefreshToken, refreshSession]);

  if (!hasAccessToken && hasRefreshToken && isLoading) {
    return <PageLoader fullHeight />;
  }

  if (!hasAccessToken || authStatus !== 'authenticated') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export function AdminTopbar() {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const [logout, { isLoading }] = useLogoutMutation();

  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-red-700">{t('admin.dashboardTitle')}</p>
        <h1 className="mt-2 font-display text-3xl font-black text-stone-900">
          {user?.name || user?.email || 'Editorial session'}
        </h1>
        <p className="mt-1 text-sm text-stone-600">Role: {user?.role ?? 'editor'}</p>
      </div>
      <button
        type="button"
        disabled={isLoading}
        onClick={() => void logout()}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        {t('common.logout')}
      </button>
    </div>
  );
}

export function NotFoundState() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-xl rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-xl shadow-stone-200/40">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-red-700">404</p>
        <h1 className="mt-3 font-display text-4xl font-black text-stone-900">Page not found</h1>
        <p className="mt-4 text-sm leading-6 text-stone-600">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}

export function IconStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 text-red-700">{icon}</div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-stone-900">{value}</p>
    </div>
  );
}

export function VideoBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-amber-700">
      <PlayCircle className="h-3.5 w-3.5" />
      Video
    </div>
  );
}
