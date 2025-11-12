import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AuthButton } from '@/components/organisms/AuthButton/AuthButton';
import { render } from '@/test/test-utils';

import '@/__mocks__/firebase'; // Import the global mock
import * as AuthContext from '@/context/AuthContext';

// --- Mocks Setup ---

const logoutMock = vi.fn();
vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
  isAuthenticated: true,
  user: { name: 'Tester', picture: 'http://pic.com/pic.jpg', id: 'test-user' },
  logout: logoutMock,
  loginWithRedirect: vi.fn(),
} as any);

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
