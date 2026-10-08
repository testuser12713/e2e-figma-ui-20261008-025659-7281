import { describe, expect, it } from 'vitest';
import { orders } from '../../data/orders';
import {
  filterOrdersByStatus,
  selectOrders,
  sortOrders,
} from './filterOrders';

describe('filterOrdersByStatus', () => {
  it('returns every order for the "all" filter', () => {
    expect(filterOrdersByStatus(orders, 'all')).toHaveLength(orders.length);
  });

  it('keeps only orders with the selected status', () => {
    const result = filterOrdersByStatus(orders, 'overdue');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((order) => order.status === 'overdue')).toBe(true);
  });

  it('does not mutate the input array', () => {
    const copy = orders.slice();
    filterOrdersByStatus(orders, 'paid');
    expect(orders).toEqual(copy);
  });
});

describe('sortOrders', () => {
  it('keeps the given order when sort is null', () => {
    expect(sortOrders(orders, null).map((order) => order.id)).toEqual(
      orders.map((order) => order.id),
    );
  });

  it('sorts by date ascending and descending', () => {
    const ascending = sortOrders(orders, { key: 'date', direction: 'asc' });
    for (let i = 1; i < ascending.length; i += 1) {
      expect(ascending[i - 1].date <= ascending[i].date).toBe(true);
    }

    const descending = sortOrders(orders, { key: 'date', direction: 'desc' });
    for (let i = 1; i < descending.length; i += 1) {
      expect(descending[i - 1].date >= descending[i].date).toBe(true);
    }
  });

  it('sorts by amount ascending and descending', () => {
    const ascending = sortOrders(orders, { key: 'amount', direction: 'asc' });
    for (let i = 1; i < ascending.length; i += 1) {
      expect(ascending[i - 1].total <= ascending[i].total).toBe(true);
    }

    const descending = sortOrders(orders, { key: 'amount', direction: 'desc' });
    for (let i = 1; i < descending.length; i += 1) {
      expect(descending[i - 1].total >= descending[i].total).toBe(true);
    }
  });

  it('does not mutate the input array', () => {
    const copy = orders.slice();
    sortOrders(orders, { key: 'amount', direction: 'desc' });
    expect(orders).toEqual(copy);
  });
});

describe('selectOrders', () => {
  it('filters and sorts together', () => {
    const result = selectOrders(orders, 'shipped', {
      key: 'amount',
      direction: 'desc',
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((order) => order.status === 'shipped')).toBe(true);
    for (let i = 1; i < result.length; i += 1) {
      expect(result[i - 1].total >= result[i].total).toBe(true);
    }
  });
});
