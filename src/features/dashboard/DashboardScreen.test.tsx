import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DashboardScreen from './DashboardScreen';
import { activity } from '../../data/activity';
import { formatCurrencyEUR } from '../../lib/format';
import {
  averageOrderValue,
  countOpenOrders,
  currentMonthRevenue,
  newCustomersThisMonth,
} from './dashboardMetrics';

describe('DashboardScreen', () => {
  it('renders the page header with a single top-level heading', () => {
    render(<DashboardScreen />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeInTheDocument();
  });

  it('renders four KPI cards with non-empty values', () => {
    render(<DashboardScreen />);

    const revenue = document.getElementById('kpi-revenue');
    const openOrders = document.getElementById('kpi-open-orders');
    const newCustomers = document.getElementById('kpi-new-customers');
    const averageOrder = document.getElementById('kpi-avg-order');

    expect(revenue).not.toBeNull();
    expect(openOrders).not.toBeNull();
    expect(newCustomers).not.toBeNull();
    expect(averageOrder).not.toBeNull();

    expect(within(revenue as HTMLElement).getByText('Umsatz (Monat)')).toBeInTheDocument();
    expect(within(openOrders as HTMLElement).getByText('Offene Aufträge')).toBeInTheDocument();
    expect(within(newCustomers as HTMLElement).getByText('Neue Kunden')).toBeInTheDocument();
    expect(within(averageOrder as HTMLElement).getByText('Ø Auftragswert')).toBeInTheDocument();

    expect((revenue as HTMLElement).textContent).toMatch(/EUR/);
    expect((openOrders as HTMLElement).textContent).toMatch(/\d/);
    expect((newCustomers as HTMLElement).textContent).toMatch(/\d/);
    expect((averageOrder as HTMLElement).textContent).toMatch(/EUR/);

    expect((revenue as HTMLElement).textContent).toContain(
      formatCurrencyEUR(currentMonthRevenue()),
    );
    expect((openOrders as HTMLElement).textContent).toContain(String(countOpenOrders()));
    expect((newCustomers as HTMLElement).textContent).toContain(String(newCustomersThisMonth()));
    expect((averageOrder as HTMLElement).textContent).toContain(
      formatCurrencyEUR(averageOrderValue()),
    );
  });

  it('renders the revenue chart card with an accessible chart and hidden data table', () => {
    render(<DashboardScreen />);

    const chartCard = document.getElementById('revenue-chart-card');
    expect(chartCard).not.toBeNull();
    expect(
      within(chartCard as HTMLElement).getByRole('heading', { name: 'Umsatzentwicklung' }),
    ).toBeInTheDocument();
    expect(
      within(chartCard as HTMLElement).getByText('Letzte 12 Monate'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('img', { name: /Umsatzentwicklung der letzten 12 Monate/ }),
    ).toBeInTheDocument();

    const table = screen.getByRole('table', { name: 'Umsatzwerte pro Monat' });
    expect(within(table).getAllByRole('row')).toHaveLength(13);
  });

  it('renders the activity card listing the recent activity entries', () => {
    render(<DashboardScreen />);

    const activityCard = document.getElementById('activity-card');
    expect(activityCard).not.toBeNull();
    expect(
      within(activityCard as HTMLElement).getByRole('heading', { name: 'Letzte Aktivitäten' }),
    ).toBeInTheDocument();

    const expectedCount = Math.min(6, activity.length);
    const list = screen.getByRole('list', { name: 'Aktivitäten' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(expectedCount);
    expect(within(list).getByText(activity[0].text)).toBeInTheDocument();
  });
});
