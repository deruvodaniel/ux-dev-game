# Components & Logic

## Component Structure

### Atomic Design Implementation

The project strictly follows Atomic Design.

#### Atoms

- **Responsibility**: Basic UI elements with no business logic.
- **Examples**: `Button`, `Typography`, `Avatar`.
- **State**: Stateless or purely UI state (hover, active).

#### Molecules

- **Responsibility**: Groups of atoms functioning as a unit.
- **Examples**: `UserMenu` (Avatar + Dropdown), `CardHand` (List of Cards).
- **State**: Local state for interaction (open/close menu).

#### Organisms

- **Responsibility**: Complex sections of the interface. Can interact with Contexts.
- **Examples**: `Header` (Logo + Nav + UserMenu), `Ladderboard` (List of Players).
- **State**: Can fetch data or subscribe to Contexts.

#### Pages

- **Responsibility**: Route handlers. They connect Organisms to the Global State/Services.
- **Examples**: `DashboardPage`, `BattlePage`.
- **Logic**:
  - Check authentication (`RequireAuth`).
  - Trigger initial data fetches.
  - Layout composition.

## Business Logic & Services

### Service Layer Pattern

All direct interactions with Firebase Firestore are encapsulated in `src/services`.

**Example: `src/services/players.ts`**

```typescript
// Service function
export const fetchPlayers = async (): Promise<Player[]> => {
  const snapshot = await getDocs(playersCollectionRef);
  // ... transformation logic
  return players;
};
```

**Usage in Components/Context:**
Components **do not** import Firebase functions directly. They use:

1. **Context Hooks**: `usePlayers()` which internally calls services.
2. **Service Functions**: Directly imported in `useEffect` if no global state is needed (rare).

### Context Logic

Contexts act as the "Controller" in MVC terms.

- **`PlayersContext`**:
  - Holds `players` array state.
  - `refreshLadder()`: Calls `fetchPlayers` service and updates state.
  - `updatePlayer()`: Calls `savePlayer` service and updates local state optimistically.

### Data Flow

1. **User Action**: User clicks "Save Profile".
2. **Component**: `ProfileSetupPage` calls `updatePlayer(id, data)` from `usePlayers`.
3. **Context**: `PlayersContext` receives call.
4. **Service**: Calls `savePlayer(data)` in `services/players.ts`.
5. **Firebase**: Updates Firestore document.
6. **State Update**: Context updates local `players` state to reflect change immediately.
