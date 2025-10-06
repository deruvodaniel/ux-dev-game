import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AudioProvider } from '@/context/AudioContext';
import { AuthProvider } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';
import { ModalProvider } from '@/context/ModalContext';
import { NetworkActivityProvider } from '@/context/NetworkActivityContext';
import { PlayersProvider } from '@/context/PlayersContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';

import './index.css';
import './theme/tokens.css';
import './theme/global.css';

import '@/i18n';
import { App } from '@/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <PlayersProvider>
            <NetworkActivityProvider>
              <GameProvider>
                <AudioProvider>
                  <ModalProvider>
                    <App />
                  </ModalProvider>
                </AudioProvider>
              </GameProvider>
            </NetworkActivityProvider>
          </PlayersProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
