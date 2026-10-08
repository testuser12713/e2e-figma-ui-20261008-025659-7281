import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { customers } from '../../data/customers';
import { FilterProvider } from '../../state/FilterContext';
import CustomerListScreen from './CustomerListScreen';

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/customers']}>
      <FilterProvider>
        <Routes>
          <Route path="/customers" element={<CustomerListScreen />} />
          <Route path="/customers/:customerId" element={<div>Kundendetail geöffnet</div>} />
        </Routes>
      </FilterProvider>
    </MemoryRouter>,
  );
}

function rows() {
  return screen.getAllByTestId('customer-row');
}

describe('CustomerListScreen', () => {
  it('lists every customer from the data module (at least 20)', () => {
    renderScreen();
    expect(rows()).toHaveLength(customers.length);
    expect(rows().length).toBeGreaterThanOrEqual(20);
  });

  it('narrows the list live while typing and restores all rows when cleared', async () => {
    const user = userEvent.setup();
    renderScreen();

    const search = screen.getByLabelText('Kunden durchsuchen');
    await user.type(search, 'Nordwind');

    expect(rows()).toHaveLength(1);
    expect(screen.getByText('Nordwind Logistik')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Suche löschen' }));
    expect(rows()).toHaveLength(customers.length);
  });

  it('filters by a status chip', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Neu' }));
    const pendingCount = customers.filter((customer) => customer.status === 'pending').length;
    expect(rows()).toHaveLength(pendingCount);
  });

  it('filters by the new Gefährdet status chip', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Gefährdet' }));
    const atRiskCount = customers.filter((customer) => customer.status === 'at_risk').length;
    expect(atRiskCount).toBeGreaterThan(0);
    expect(rows()).toHaveLength(atRiskCount);
  });

  it('shows an explicit empty state and resets search and filter from it', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.type(screen.getByLabelText('Kunden durchsuchen'), 'zzz-no-match');
    expect(screen.getByRole('heading', { name: 'Keine Kunden gefunden' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Filter zurücksetzen' }));
    expect(rows()).toHaveLength(customers.length);
  });

  it('navigates to the customer detail route when a row is clicked', async () => {
    const user = userEvent.setup();
    renderScreen();

    const first = rows()[0];
    expect(first).toBeDefined();
    await user.click(first as HTMLElement);

    expect(screen.getByText('Kundendetail geöffnet')).toBeInTheDocument();
  });

  it('opens a row with Enter when it has keyboard focus', async () => {
    const user = userEvent.setup();
    renderScreen();

    const first = rows()[0] as HTMLElement;
    first.focus();
    expect(first).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(screen.getByText('Kundendetail geöffnet')).toBeInTheDocument();
  });

  it('renders the new-customer control as visibly unavailable (coming soon)', () => {
    renderScreen();
    const newCustomer = screen.getByRole('button', { name: 'Neuer Kunde' });
    expect(newCustomer).toBeDisabled();
    expect(newCustomer).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
  });
});
