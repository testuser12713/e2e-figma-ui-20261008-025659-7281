import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { orders } from '../../data/orders';
import { FilterProvider } from '../../state/FilterContext';
import OrderListScreen from './OrderListScreen';

function OrderDetailProbe() {
  const { orderId } = useParams();
  return <div data-testid="detail-probe">Detail {orderId}</div>;
}

function renderScreen() {
  return render(
    <FilterProvider>
      <MemoryRouter initialEntries={['/orders']}>
        <Routes>
          <Route path="/orders" element={<OrderListScreen />} />
          <Route path="/orders/:orderId" element={<OrderDetailProbe />} />
        </Routes>
      </MemoryRouter>
    </FilterProvider>,
  );
}

function getRows() {
  return screen.getAllByRole('button', { name: /^Auftrag #/ });
}

describe('OrderListScreen', () => {
  it('renders the page header, the disabled export control and all orders', () => {
    renderScreen();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Aufträge' }),
    ).toBeInTheDocument();

    const exportButton = screen.getByRole('button', { name: /Export/ });
    expect(exportButton).toBeDisabled();
    expect(exportButton).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Coming soon')).toBeInTheDocument();

    expect(getRows()).toHaveLength(orders.length);
  });

  it('renders a labelled status badge on every row', () => {
    renderScreen();

    const rows = getRows();
    expect(rows.length).toBeGreaterThanOrEqual(30);
    for (const row of rows) {
      expect(
        within(row).getByText(/Offen|Bezahlt|Versandt|Überfällig|Storniert/),
      ).toBeInTheDocument();
    }
  });

  it('filters by status and restores all orders when the filter is cleared', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: /^Überfällig/ }));

    const overdueCount = orders.filter((order) => order.status === 'overdue').length;
    const filteredRows = getRows();
    expect(filteredRows).toHaveLength(overdueCount);
    for (const row of filteredRows) {
      expect(within(row).getByText('Überfällig')).toBeInTheDocument();
    }

    await user.click(screen.getByRole('button', { name: /^Alle/ }));
    expect(getRows()).toHaveLength(orders.length);
  });

  it('opens the order detail view when a row is clicked', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(getRows()[0]);

    expect(screen.getByTestId('detail-probe')).toBeInTheDocument();
  });

  it('opens a row with the keyboard via Enter', async () => {
    const user = userEvent.setup();
    renderScreen();

    const firstRow = getRows()[0];
    firstRow.focus();
    expect(firstRow).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(screen.getByTestId('detail-probe')).toBeInTheDocument();
  });
});
