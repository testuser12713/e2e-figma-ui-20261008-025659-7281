import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';

function renderAt(path: string) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

describe('App shell', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders a persistent navigation with the three entries', () => {
    renderAt('/');
    const nav = screen.getByRole('navigation', { name: 'Hauptnavigation' });
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Customers' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Orders' })).toBeInTheDocument();
  });

  it('marks the current navigation entry with aria-current', () => {
    renderAt('/customers');
    const nav = screen.getByRole('navigation', { name: 'Hauptnavigation' });
    expect(within(nav).getByRole('link', { name: 'Customers' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('renders a friendly not-found view for an unknown route', () => {
    renderAt('/does-not-exist');
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Zum Dashboard' })).toBeInTheDocument();
  });
});
