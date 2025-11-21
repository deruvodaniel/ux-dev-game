import { initializeApp } from 'firebase/app';
import { vi } from 'vitest';

import '@testing-library/jest-dom';

// Initialize a mock Firebase app before all tests
const firebaseConfig = {
  apiKey: 'mock-key',
  authDomain: 'mock-domain',
  projectId: 'mock-project',
  storageBucket: 'mock-bucket',
  messagingSenderId: 'mock-sender',
  appId: 'mock-app',
};

initializeApp(firebaseConfig);

// --- Comprehensive Mocks ---

// Mock Firestore
const setDoc = vi.fn(() => Promise.resolve());
const getDoc = vi.fn(() =>
  Promise.resolve({ exists: () => true, data: () => ({}) }),
);
const getDocs = vi.fn(() => Promise.resolve({ docs: [] }));
const collection = vi.fn(() => ({}));
const doc = vi.fn(() => ({}));
const getFirestore = vi.fn(() => ({
  collection,
  doc,
}));

// Mock Auth
const onAuthStateChanged = vi.fn(() => vi.fn()); // Returns a mock unsubscribe function
const signOut = vi.fn(() => Promise.resolve());
const getAuth = vi.fn(() => ({
  onAuthStateChanged,
  signOut,
}));

// Apply mocks
vi.mock('firebase/firestore', () => ({
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
}));

vi.mock('firebase/auth', () => ({
  getAuth,
  onAuthStateChanged,
  signOut,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));
