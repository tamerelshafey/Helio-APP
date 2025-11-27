import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import App from './App';
import AppContextProviders from './context/AppContextProviders';
import { useStore } from './store';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Global error handler for React Query
const handleGlobalError = (error: Error) => {
  // We access the store directly outside of React components
  useStore.getState().showToast(error.message || 'حدث خطأ أثناء الاتصال بالخادم', 'error');
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      handleGlobalError(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      handleGlobalError(error);
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1, // Retry once before failing
      refetchOnWindowFocus: false, // Prevent refetching on window focus for better UX during dev
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    },
  },
});

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <AppContextProviders>
          <App />
        </AppContextProviders>
      </QueryClientProvider>
    </HashRouter>
  </React.StrictMode>
);