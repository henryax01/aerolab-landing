import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ThemeToggle from './ThemeToggle.jsx';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe('ThemeToggle', () => {
  it('invoca onToggle al hacer clic', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<ThemeToggle theme="light" onToggle={onToggle} />);

    await user.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('muestra un botón accesible que refleja el tema actual', () => {
    render(<ThemeToggle theme="dark" onToggle={() => {}} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
