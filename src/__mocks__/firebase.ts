import { vi } from 'vitest';

// --- Firebase Auth Mock ---
const onAuthStateChanged = vi.fn(() => vi.fn()); // Returns a mock unsubscribe function
const signOut = vi.fn(() => Promise.resolve());
const getAuth = vi.fn(() => ({
  onAuthStateChanged,
  signOut,
}));

// --- Firestore Mock ---
const setDoc = vi.fn(() => Promise.resolve());
const getDoc = vi.fn(() => Promise.resolve({ exists: () => true, data: () => ({}) }));

const mockDocs = (data: any[]) => ({
  docs: data.map(d => ({ id: d.id, data: () => d, exists: () => true })),
  forEach: (cb: (arg0: { id: any; data: () => any; }) => void) => {
    data.forEach(d => cb({ id: d.id, data: () => d }));
  },
});

const getDocs = vi.fn(() => Promise.resolve(mockDocs([])));
const collection = vi.fn(() => ({}));
const doc = vi.fn(() => ({}));
const getFirestore = vi.fn(() => ({}));

// --- Export Mocks ---
vi.mock('firebase/auth', () => ({
  getAuth,
  signOut,
  onAuthStateChanged,
}));

vi.mock('firebase/firestore', () => ({
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
}));

// Utility to reset mocks between tests
export const resetFirebaseMocks = () => {
  onAuthStateChanged.mockClear();
  signOut.mockClear();
  getAuth.mockClear();
  setDoc.mockClear();
  getDoc.mockClear();
  getDocs.mockClear();
  collection.mockClear();
  doc.mockClear();
  getFirestore.mockClear();
};

// Utility to control getDocs behavior
export const mockFirestoreDocs = (service: string, data: any[]) => {
  if (service === 'players') {
    getDocs.mockResolvedValue(mockDocs(data));
  }
};
