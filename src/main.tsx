import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import './index.css';
import './app/i18n';
import App from './App';
import { store } from './app/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            className: 'border border-stone-200 bg-white text-stone-900',
          }}
        />
      </Provider>
    </HelmetProvider>
  </StrictMode>,
);
