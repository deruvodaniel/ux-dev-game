import type { Meta, StoryObj } from '@storybook/react-vite';

import { WinLossCounter } from './WinLossCounter';

const meta: Meta<typeof WinLossCounter> = {
  title: 'atoms/WinLossCounter',
  component: WinLossCounter,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof WinLossCounter>;

export const Default: Story = {
  args: {
    wins: 10,
    losses: 5,
  },
};
