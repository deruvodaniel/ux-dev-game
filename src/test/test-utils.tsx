
import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AuthProvider } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';
import { ModalProvider } from '@/context/ModalContext';
import { PlayersProvider } from '@/context/PlayersContext';
import { ToastProvider } from '@/context/ToastContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <ToastProvider>
        <AuthProvider>
          <PlayersProvider>
            <GameProvider>
              <ModalProvider>{children}</ModalProvider>
            </GameProvider>
          </PlayersProvider>
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
