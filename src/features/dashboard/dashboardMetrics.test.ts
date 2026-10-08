import { describe, expect, it } from 'vitest';
import type { ActivityEntry, Order } from '../../types/models';
import {
  REFERENCE_MONTH,
  averageOrderValue,
  countOpenOrders,
  currentMonthRevenue,
  latestMonth,
  monthKey,
  monthLabelDe,
  monthlyRevenueSeries,
  newCustomersThisMonth,
} from './dashboardMetrics';

function makeOrder(partial: Partial<Order>): Order {
  return {
    id: 'O-1',
    orderNumber: '#1',
    customerId: 'C-1',
    date: '2026-01-15',
    status: 'open',
    lines: [],
    subtotal: 100,
    vat: 19,
    total: 119,
    ...partial,
  };
}

function makeActivity(partial: Partial<ActivityEntry>): ActivityEntry {
  return {
    id: 'A-1',
    date: '2026-01-15',
    kind: 'order',
    text: 'Ereignis',
    ...partial,
  };
}

describe('month helpers', () => {
  it('extracts the year-month key from an ISO date', () => {
    expect(monthKey('2026-12-12')).toBe('2026-12');
  });

  it('maps a month key to its German short label', () => {
    expect(monthLabelDe('2026-12')).toBe('Dez');
    expect(monthLabelDe('2026-03')).toBe('Mär');
    expect(monthLabelDe('2026-01')).toBe('Jan');
  });

  it('picks the latest month across a list of dates', () => {
    expect(latestMonth(['2025-12-22', '2026-12-12', '2024-01-01'])).toBe('2026-12');
    expect(latestMonth([])).toBe('0000-00');
  });

  it('derives a reference month from the mock data', () => {
    expect(REFERENCE_MONTH).toMatch(/^\d{4}-\d{2}$/);
  });
});

describe('monthlyRevenueSeries', () => {
  it('returns one point per month, ending at the requested month', () => {
    const list = [
      makeOrder({ date: '2025-12-20', total: 200 }),
      makeOrder({ date: '2026-01-05', total: 100 }),
      makeOrder({ date: '2026-01-25', total: 50 }),
    ];

    const series = monthlyRevenueSeries(list, 3, '2026-01');

    expect(series.map((point) => point.month)).toEqual(['2025-11', '2025-12', '2026-01']);
    expect(series.map((point) => point.revenue)).toEqual([0, 200, 150]);
    expect(series[0].label).toBe('Nov');
  });

  it('defaults to twelve points and carries the real mock data', () => {
    const series = monthlyRevenueSeries();
    expect(series).toHaveLength(12);
    expect(series[11].month).toBe(REFERENCE_MONTH);
    expect(series.some((point) => point.revenue > 0)).toBe(true);
  });
});

describe('currentMonthRevenue', () => {
  it('sums only the orders of the requested month', () => {
    const list = [
      makeOrder({ date: '2026-01-05', total: 100 }),
      makeOrder({ date: '2026-01-25', total: 50 }),
      makeOrder({ date: '2025-12-31', total: 999 }),
    ];

    expect(currentMonthRevenue(list, '2026-01')).toBe(150);
  });

  it('returns zero when the month has no orders', () => {
    expect(currentMonthRevenue([makeOrder({ date: '2026-01-05' })], '2026-02')).toBe(0);
  });
});

describe('countOpenOrders', () => {
  it('counts only orders with the open status', () => {
    const list = [
      makeOrder({ status: 'open' }),
      makeOrder({ status: 'paid' }),
      makeOrder({ status: 'open' }),
      makeOrder({ status: 'overdue' }),
    ];

    expect(countOpenOrders(list)).toBe(2);
  });

  it('counts at least one open order in the mock data', () => {
    expect(countOpenOrders()).toBeGreaterThan(0);
  });
});

describe('newCustomersThisMonth', () => {
  it('counts new-customer events in the requested month', () => {
    const entries = [
      makeActivity({ kind: 'customer', date: '2026-01-10' }),
      makeActivity({ kind: 'order', date: '2026-01-11' }),
      makeActivity({ kind: 'customer', date: '2025-12-10' }),
      makeActivity({ kind: 'invoice', date: '2026-01-12' }),
    ];

    expect(newCustomersThisMonth(entries, '2026-01')).toBe(1);
  });

  it('reports the number for the real reference month', () => {
    expect(newCustomersThisMonth()).toBeGreaterThanOrEqual(0);
  });
});

describe('averageOrderValue', () => {
  it('averages the order totals', () => {
    const list = [makeOrder({ total: 100 }), makeOrder({ total: 250 })];

    expect(averageOrderValue(list)).toBeCloseTo(175, 2);
  });

  it('returns zero for an empty order list', () => {
    expect(averageOrderValue([])).toBe(0);
  });

  it('produces a positive average for the mock data', () => {
    expect(averageOrderValue()).toBeGreaterThan(0);
  });
});
