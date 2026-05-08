import { useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LockKeyhole } from 'lucide-react';
import { Seo } from '../components/ui';
import { getAccessToken } from '../app/tokenManager';
import { useLoginMutation } from '../services/authApi';

interface LoginLocationState {
  from?: string;
}

export default function AdminLoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LoginLocationState;
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (getAccessToken()) {
    return <Navigate to={state.from || '/admin'} replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login({ email: email.trim(), password: password.trim() }).unwrap();
      toast.success('Logged in successfully');
      navigate(state.from || '/admin', { replace: true });
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'data' in error
          ? String((error as { data?: { message?: string } }).data?.message ?? 'Login failed')
          : 'Login failed';

      toast.error(message);
    }
  };

  return (
    <>
      <Seo title="Admin login | MV News" description="Secure editorial login for managing news, candidates, and videos." />
      <div className={`flex min-h-screen items-center justify-center px-4 py-10 ${i18n.language === 'ta' ? 'font-tamil' : ''}`}>
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white shadow-2xl shadow-stone-300/25 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="hidden bg-gradient-to-br from-red-900 via-red-700 to-amber-500 p-10 text-white lg:block">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/80">{t('brand')}</p>
            <h1 className="mt-6 font-display text-5xl font-black leading-tight">Manage the newsroom from one editorial cockpit.</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-white/80">
              Create stories, feature headlines, upload visuals through the backend, and keep the candidate and video pages fresh.
            </p>
          </div>
          <div className="p-8 sm:p-10">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700">
              <LockKeyhole className="h-7 w-7" />
            </div>
            <h2 className="font-display text-4xl font-black text-stone-900">{t('admin.loginTitle')}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Access is kept in memory on the client, and refresh can happen silently when the backend session allows it.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-stone-700">{t('admin.email')}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-red-400 focus:bg-white"
                  placeholder="editor@mvnews.com"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-stone-700">{t('admin.password')}</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-red-400 focus:bg-white"
                  placeholder="••••••••"
                />
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isLoading ? 'Signing in...' : t('admin.signIn')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
