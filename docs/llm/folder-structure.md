# Folder Structure

## Root Directory

- **`.storybook/`**: Storybook configuration.
- **`e2e/`**: Playwright end-to-end tests.
- **`src/`**: Main source code.
- **`public/`**: Static assets (images, icons).
- **`docs/`**: Project documentation.

## Source Directory (`src/`)

### `components/`

Follows Atomic Design methodology:

- **`atoms/`**: Smallest components (e.g., `Button`, `Typography`).
- **`molecules/`**: Combinations of atoms (e.g., `UserMenu`, `CardHand`).
- **`organisms/`**: Complex sections (e.g., `Header`, `Ladderboard`).
- **`templates/`**: Page layouts (if used).

### `context/`

React Context Providers for global state.

- Example: `AuthContext.tsx`, `PlayersContext.tsx`.
- **Pattern**: Exports `Provider` component and `use[Name]` hook.

### `services/`

Backend interaction layer (Firebase).

- **`firebase.ts`**: Firebase initialization.
- **`players.ts`**: Player data CRUD operations.
- **`auth.ts`**: Authentication logic.

### `hooks/`

Custom React hooks.

- **`useLoadPlayerProfile.ts`**: Data fetching hooks.
- **`useMusicContext.ts`**: Audio control hooks.

### `pages/`

Top-level route components.

- **`DashboardPage/`**: Main user dashboard.
- **`BattlePage/`**: Game battle interface.
- **`WelcomePage/`**: Landing page.

### `types/`

TypeScript type definitions.

- **Shared types** used across services and components.

### `theme/`

Global styling configuration.

- **`tokens.css`**: CSS variables for colors, spacing, etc.
- **`global.css`**: Global resets and base styles.

### `utils/`

Helper functions and utilities.

### `i18n/`

Internationalization configuration (i18next).
