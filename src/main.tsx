import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppProviders } from '@/context/AppProviders';

import './index.css';
import './theme/tokens.css';
import './theme/global.css';

import '@/i18n';
import { App } from '@/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
