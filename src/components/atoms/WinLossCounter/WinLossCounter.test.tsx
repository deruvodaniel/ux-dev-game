import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { WinLossCounter } from './WinLossCounter';

// Mock react-i18next to return the key itself
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Return the key
  }),
}));

describe('WinLossCounter', () => {
  it('renders the correct number of wins and losses', () => {
    render(<WinLossCounter wins={15} losses={7} />);

    // Test against the translation keys
    const winElement = screen.getByText(/stats.wins: 15/i);
    const lossElement = screen.getByText(/stats.losses: 7/i);

    expect(winElement).toBeInTheDocument();
    expect(lossElement).toBeInTheDocument();
  });

  it('has the correct data-testid', () => {
    render(<WinLossCounter wins={0} losses={0} />);
    const counterElement = screen.getByTestId('win-loss-counter');
    expect(counterElement).toBeInTheDocument();
  });
});
