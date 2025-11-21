# Improvements & Recommendations

## 1. Context Provider Hell

**Issue**: `main.tsx` has a deep "pyramid of doom" with nested Context Providers.
**Impact**: Hard to read, maintain, and reorder.
**Recommendation**: Create a `ComposeProviders` utility or a single `AppProviders` component to group them.

```tsx
// Example
export const AppProviders = ({ children }) => (
  <ThemeProvider>
    <ToastProvider>
      <AuthProvider>
        {/* ... */}
        {children}
      </AuthProvider>
    </ToastProvider>
  </ThemeProvider>
);
```

## 2. Routing Logic

**Issue**: `App.tsx` contains a `RouteSyncer` component that manually synchronizes URL changes with global state.
**Impact**: Implicit dependency between routing and state; potential for race conditions or double-fetches.
**Recommendation**: Move synchronization logic into a custom hook or a dedicated Layout component that wraps authenticated routes.

## 3. Type Safety

**Issue**: Some `any` types or loose typing might exist (need to verify strictness).
**Impact**: Reduces confidence in refactoring.
**Recommendation**:

- Ensure `tsconfig.json` has `strict: true`.
- Audit `types/` folder for `any` usage.
- Use `zod` for runtime validation of Firebase data.

## 4. Performance

**Issue**: `PlayersContext` fetches all players on load.
**Impact**: Scalability issue as player base grows.
**Recommendation**: Implement pagination or infinite scroll for the Ladderboard.

## 5. Testing

**Issue**: `__tests__` folder exists, but coverage might be limited.
**Impact**: Regression risks.
**Recommendation**:

- Add unit tests for all Services (`src/services/*.ts`).
- Add integration tests for Context Providers.

## 6. Component Props

**Issue**: Some components might be missing explicit `Props` interfaces.
**Recommendation**: Enforce a standard `Props` interface for all components to improve discoverability and type checking.
