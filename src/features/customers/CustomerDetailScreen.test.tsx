import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { formatCurrencyEUR } from '../../lib/format';
import CustomerDetailScreen from './CustomerDetailScreen';

function renderDetail(customerId: string) {
  return render(
    <MemoryRouter initialEntries={[`/customers/${customerId}`]}>
      <Routes>
        <Route path="/customers/:customerId" element={<CustomerDetailScreen />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CustomerDetailScreen', () => {
  it('renders the customer contact data from the route id', () => {
    renderDetail('C-001');

    expect(screen.getByRole('heading', { name: 'Anna Meier' })).toBeInTheDocument();
    expect(screen.getByText('Nordwind Logistik')).toBeInTheDocument();
    expect(screen.getByText('C-001')).toBeInTheDocument();
    expect(screen.getByText('anna.meier@nordwindlogistik.de')).toBeInTheDocument();
    expect(screen.getByText('+49 848 5496336')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText('Aktiv')).toBeInTheDocument();
    expect(screen.getByText('21.03.2023')).toBeInTheDocument();
  });

  it('shows the revenue and the matching order history', () => {
    renderDetail('C-001');

    expect(screen.getByRole('heading', { name: 'Kennzahlen' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Auftragshistorie' })).toBeInTheDocument();
    const revenuePattern = new RegExp(
      formatCurrencyEUR(20842.31)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\s/g, '\\s'),
    );
    expect(screen.getAllByText(revenuePattern).length).toBeGreaterThan(0);
    expect(screen.getByText('#1001')).toBeInTheDocument();
    expect(screen.getByText('#1025')).toBeInTheDocument();
    expect(screen.getByText('11.10.2025')).toBeInTheDocument();
    expect(screen.getByText('15.04.2025')).toBeInTheDocument();
    expect(screen.getByText('Offen')).toBeInTheDocument();
    expect(screen.getByText('Überfällig')).toBeInTheDocument();
  });

  it('renders the not-found view for an unknown customer id', () => {
    renderDetail('C-999');

    expect(screen.getByText('Diese Seite wurde nicht gefunden.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Zum Dashboard' })).toBeInTheDocument();
  });

  it('offers a back control to the customer list', () => {
    renderDetail('C-001');

    const backLink = screen.getByRole('link', { name: 'Zurück zur Liste' });
    expect(backLink).toHaveAttribute('href', '/customers');
  });
});
