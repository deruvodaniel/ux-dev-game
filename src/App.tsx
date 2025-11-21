import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppFooter } from '@/components/organisms/AppFooter/AppFooter';
import { RequireAuth } from '@/components/organisms/AuthGate/RequireAuth';
import { GlobalLoadingOverlay } from '@/components/organisms/GlobalLoadingOverlay/GlobalLoadingOverlay';
import { Header } from '@/components/organisms/Header/Header';
import { Ladderboard } from '@/components/organisms/Ladderboard/Ladderboard';
import { BattlePage } from '@/pages/BattlePage/BattlePage';
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';
import { ProfileSetupPage } from '@/pages/ProfileSetupPage/ProfileSetupPage';
import { ProgressMapPage } from '@/pages/ProgressMapPage/ProgressMapPage';
// SelectPage deprecated -> replaced by DashboardPage
import { WelcomePage } from '@/pages/WelcomePage/WelcomePage';

import { useRouteSync } from '@/hooks/useRouteSync';

import './App.css';

const RouteSyncer: React.FC = () => {
  useRouteSync();
  return null;
};

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <RouteSyncer />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route path="/select" element={<DashboardPage />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfileSetupPage />
            </RequireAuth>
          }
        />
        <Route
          path="/battle"
          element={
            <RequireAuth>
              <BattlePage />
            </RequireAuth>
          }
        />
        <Route
          path="/progress"
          element={
            <RequireAuth>
              <ProgressMapPage />
            </RequireAuth>
          }
        />
        <Route
          path="/ladder"
          element={
            <RequireAuth>
              <Ladderboard />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <AppFooter />
      <GlobalLoadingOverlay />
    </BrowserRouter>
  );
};
