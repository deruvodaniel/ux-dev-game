# Best Practices & Coding Standards

## Component Architecture

### 1. Functional Components

- Always use **React Functional Components** with TypeScript.
- Use `React.FC` or explicit return types for components.
- **Props Interface**: Define a `Props` interface for every component, even if empty.
- **Named Exports**: Use named exports (`export const Component = ...`) instead of default exports to ensure consistent naming in imports.

### 2. Atomic Design

- **Strict Hierarchy**: Components must be placed in the correct folder (`atoms`, `molecules`, `organisms`) based on their complexity and dependencies.
- **Dependency Rule**: Atoms cannot import molecules or organisms. Molecules cannot import organisms.
- **Composition**: Prefer composition (passing `children`) over complex prop drilling.

### 3. Styling

- **CSS Modules**: Use CSS Modules (`Component.module.css`) for component-specific styles to avoid class name collisions.
- **Design Tokens**: Use CSS variables from `tokens.css` for colors, spacing, and typography. Avoid hardcoded hex values.
- **ClassName Prop**: Always allow a `className` prop to be passed and merged for flexibility.

## State Management

### 1. Context API

- **Global State**: Use Context only for truly global state (Auth, Theme, User Data).
- **Custom Hooks**: Always expose context via a custom hook (e.g., `useAuth`, `usePlayers`).
- **Error Handling**: Custom hooks must throw an error if used outside their Provider.

### 2. Local State

- Use `useState` or `useReducer` for component-local state.
- Lift state up only when necessary to share between siblings.

## Code Quality

### 1. TypeScript

- **Strict Typing**: Avoid `any`. Use specific types or generics.
- **Shared Types**: Define reusable types in `src/types/` and import them using the `@/types` alias.

### 2. Imports

- **Absolute Imports**: Use the `@/` alias for all internal imports (e.g., `import { Button } from '@/components/atoms/Button'`).
- **Order**:
  1. External libraries (React, Router).
  2. Internal Contexts/Hooks.
  3. Internal Components.
  4. Styles.

### 3. Async/Await

- Use `async/await` for all asynchronous operations (Firebase calls).
- Handle errors with `try/catch` blocks, especially in services.

## Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`).
- **Functions/Variables**: camelCase (e.g., `fetchUserData`).
- **Files**: Match the primary export name.
- **Folders**: PascalCase for component folders.
