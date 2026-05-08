import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  PageLoader,
  NotFoundState,
  ProtectedRoute,
  ScrollToTop,
  SiteLayout,
} from './components/ui';
import { AUTH_LOGOUT_EVENT } from './app/tokenManager';
import { clearSession } from './app/authSlice';
import { useAppDispatch } from './app/hooks';

function AuthEventBridge() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleForcedLogout = () => {
      dispatch(clearSession());
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
  }, [dispatch]);

  return null;
}

const HomePage = lazy(() => import('./Pages/HomePage'));
const CategoryPage = lazy(() => import('./Pages/CategoryPage'));
const ArticlePage = lazy(() => import('./Pages/ArticlePage'));
const CandidatePage = lazy(() => import('./Pages/CandidatePage'));
const CandidatesPage = lazy(() => import('./Pages/CandidatesPage'));
const VideosPage = lazy(() => import('./Pages/VideosPage'));
const AdminLoginPage = lazy(() => import('./Pages/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./Pages/AdminDashboard'));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthEventBridge />
      <Suspense fallback={<PageLoader fullHeight />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/news/:slug" element={<ArticlePage />} />
            <Route path="/candidate/:id" element={<CandidatePage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/videos" element={<VideosPage />} />
          </Route>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundState />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
