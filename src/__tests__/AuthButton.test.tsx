import { fireEvent, screen, waitFor } from '@testing-library/react';
import type { User } from 'firebase/auth';
import { describe, expect, it, vi } from 'vitest';

import { AuthButton } from '@/components/organisms/AuthButton/AuthButton';

import * as AuthContext from '@/context/AuthContext';

import '@/__mocks__/firebase'; // Import the global mock
import { render } from '@/test/test-utils';

// --- Mocks Setup ---

const logoutMock = vi.fn();
vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
  signOut: logoutMock,
  signIn: vi.fn(),
  user: {
    displayName: 'Tester',
    photoURL: 'http://pic.com/pic.jpg',
    uid: 'test-user',
  } as User,
});

// --- Test Suite ---

describe('AuthButton', () => {
  it('renders logout button when authenticated and triggers logout', async () => {
    render(<AuthButton />);
    const btn = await screen.findByRole('button', { name: /Cerrar sesión/i });

    fireEvent.click(btn);

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled();
    });
  });
});
