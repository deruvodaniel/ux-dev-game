import React from 'react';

import { AudioProvider } from '@/context/AudioContext';
import { AuthProvider } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';
import { ModalProvider } from '@/context/ModalContext';
import { NetworkActivityProvider } from '@/context/NetworkActivityContext';
import { PlayersProvider } from '@/context/PlayersContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <PlayersProvider>
            <NetworkActivityProvider>
              <GameProvider>
                <AudioProvider>
                  <ModalProvider>{children}</ModalProvider>
                </AudioProvider>
              </GameProvider>
            </NetworkActivityProvider>
          </PlayersProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
