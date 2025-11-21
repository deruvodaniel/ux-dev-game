# Project Architecture

## Overview

This project is a **React** application built with **Vite**, designed as a gamified experience (likely a game or gamified dashboard). It uses **Firebase** for backend services (Authentication, Firestore). The frontend architecture follows **Atomic Design** principles for components and uses **React Context** for global state management.

## Tech Stack

### Core

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router DOM v6

### Backend / Services

- **Platform**: Firebase
- **Auth**: Firebase Auth
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage (implied by `storage.rules`)

### Styling

- **Methodology**: CSS Modules (e.g., `Button.module.css`) & Global CSS Variables
- **Theme**: Custom theming system via CSS variables (`tokens.css`, `global.css`) and `ThemeContext`.

### Testing & Quality

- **Unit/Integration**: Vitest, React Testing Library
- **E2E**: Playwright
- **Component Development**: Storybook
- **Linting/Formatting**: ESLint, Prettier

## Key Architectural Patterns

### 1. Atomic Design

Components are organized into:

- **Atoms**: Basic building blocks (Buttons, Inputs).
- **Molecules**: Groups of atoms (Search bars, Form fields).
- **Organisms**: Complex UI sections (Header, Footer, specific game widgets).
- **Templates**: Page layouts.
- **Pages**: Route handlers connecting templates to data.

### 2. Service Layer

Business logic and API interactions are encapsulated in the `src/services` directory.

- **Pattern**: Functions that return Promises (e.g., `fetchPlayers`, `savePlayer`).
- **Role**: Decouples UI from Firebase specifics.

### 3. State Management

Global state is managed via React Context providers located in `src/context`.

- **Key Contexts**:
  - `AuthContext`: User authentication state.
  - `GameContext`: Core game state.
  - `PlayersContext`: Player data and ladder logic.
  - `ThemeContext`: UI theming.
  - `ToastContext`: Notification system.

### 4. Routing & Synchronization

- **Router**: `BrowserRouter` wraps the app.
- **RouteSyncer**: A specialized component (`App.tsx`) handles synchronizing URL state with global game/player state.
- **AuthGate**: `RequireAuth` component protects private routes.
