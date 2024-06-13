import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Spinner from './components/common/Spinner/Spinner';
import './index.scss';

const App = React.lazy(() => import('./App'));

const Bootstrap: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  );
};

const rootElement = document.getElementById('app');
if (rootElement === null)
  throw new Error('Root container missing in index.html');

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Bootstrap />
    </BrowserRouter>
  </StrictMode>,
);

export default Bootstrap;
