import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProfileSetupPage } from '@/pages/ProfileSetupPage/ProfileSetupPage';

import '@/__mocks__/firebase';
import { render } from '@/test/test-utils';
import * as avatarService from '@/services/avatars';
import * as playerService from '@/services/players';

// --- Mocks Setup ---

vi.mock('@/services/avatars');
vi.mock('@/services/players');

(URL as unknown as { createObjectURL?: (f: File) => string }).createObjectURL = vi
  .fn()
  .mockReturnValue('blob:preview');

vi.mock('@/context/AuthContext', async importOriginal => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useAuth: () => ({ isAuthenticated: true, user: { id: 'user-id' } }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

// --- Helpers ---

function seedPlayer() {
  const player = {
    id: 'user-id',
    name: 'Old Name',
    level: 1,
    experience: 0,
  };
  localStorage.setItem('duelo_player_state_v1', JSON.stringify(player));
}

// --- Test Suite ---

describe('ProfileSetupPage', () => {
  beforeEach(() => {
    localStorage.clear();
    seedPlayer();
    vi.clearAllMocks();

    vi.mocked(avatarService.uploadAvatar).mockResolvedValue('user-id/avatar.png');
    vi.mocked(avatarService.publicAvatarUrlFor).mockReturnValue(
      'https://example.com/user-id/avatar.png'
    );
    vi.mocked(playerService.updatePlayerAvatar).mockResolvedValue(undefined);
    vi.mocked(playerService.updatePlayerProfile).mockResolvedValue(undefined);
    vi.mocked(playerService.savePlayer).mockResolvedValue(undefined);
    vi.mocked(playerService.ensureRemotePlayerRecord).mockResolvedValue({
      id: 'user-id',
      level: 1,
      experience: 0,
    } as any);
    vi.mocked(playerService.fetchPlayerById).mockResolvedValue({
      id: 'user-id',
      name: 'Synced Name',
    } as any);
  });

  it('updates name, uploads avatar, and navigates', async () => {
    render(
      <Routes>
        <Route path="/" element={<ProfileSetupPage />} />
        <Route path="/ladder" element={<div>Ladder Page</div>} />
      </Routes>
    );

    const nameInput = await screen.findByDisplayValue('Old Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const fileInput = document.getElementById('avatarFile') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    const saveBtn = await screen.findByRole('button', { name: /Save and Continue/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(avatarService.uploadAvatar).toHaveBeenCalledWith(file, 'user-id');
    });

    await waitFor(() => {
      expect(playerService.updatePlayerProfile).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'New Name' })
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Ladder Page')).toBeInTheDocument();
    });
  });
});
