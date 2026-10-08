import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import OrderDetailScreen from './OrderDetailScreen';

function renderOrder(orderId: string) {
  return render(
    <MemoryRouter initialEntries={[`/orders/${orderId}`]}>
      <Routes>
        <Route path="/orders/:orderId" element={<OrderDetailScreen />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('OrderDetailScreen', () => {
  it('renders the order header, its line items and the three sums', () => {
    const { container } = renderOrder('O-003');

    expect(screen.getByText('Clara Fischer')).toBeInTheDocument();
    expect(screen.getByText('12.12.2026')).toBeInTheDocument();
    expect(screen.getByText('Bezahlt')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-od-id^="line-item-"]')).toHaveLength(2);

    expect(screen.getByText('Wartungspaket Jahresbasis')).toBeInTheDocument();
    expect(screen.getByText('Managed Server Stunde')).toBeInTheDocument();

    expect(screen.getByText('2.131,85 EUR')).toBeInTheDocument();
    expect(screen.getByText('4.540,80 EUR')).toBeInTheDocument();

    expect(screen.getByText('Zwischensumme')).toBeInTheDocument();
    expect(screen.getByText('6.672,65 EUR')).toBeInTheDocument();
    expect(screen.getByText('1.267,80 EUR')).toBeInTheDocument();
    expect(screen.getByText('7.940,45 EUR')).toBeInTheDocument();
  });

  it('links back to the orders list', () => {
    renderOrder('O-003');

    const back = screen.getByRole('link', { name: /Zurück zur Liste/ });
    expect(back).toHaveAttribute('href', '/orders');
  });

  it('marks the invoice download as unavailable instead of doing nothing', () => {
    renderOrder('O-003');

    expect(screen.getByRole('button', { name: /Rechnung herunterladen/ })).toBeDisabled();
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
  });

  it('shows the not-found view for an unknown order id', () => {
    renderOrder('O-999');

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.queryByText('Positionen')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Zum Dashboard' })).toBeInTheDocument();
  });
});
