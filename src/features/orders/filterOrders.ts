import type { Order, OrderStatus } from '../../types/models';

export type OrderSortKey = 'date' | 'amount';

export type SortDirection = 'asc' | 'desc';

export interface OrderSort {
  key: OrderSortKey;
  direction: SortDirection;
}

/**
 * Keeps only the orders whose status matches the selected filter. `'all'`
 * returns every order. Never mutates the input array.
 */
export function filterOrdersByStatus(
  orders: Order[],
  status: OrderStatus | 'all',
): Order[] {
  if (status === 'all') {
    return orders.slice();
  }
  return orders.filter((order) => order.status === status);
}

/**
 * Returns a sorted copy of the orders. `null` keeps the given order.
 * Sorting by date uses the ISO `YYYY-MM-DD` string (lexicographic order is
 * chronological); sorting by amount uses the order total. Ties fall back to
 * the order number so the resulting order is stable and deterministic.
 * Never mutates the input array.
 */
export function sortOrders(orders: Order[], sort: OrderSort | null): Order[] {
  if (sort === null) {
    return orders.slice();
  }

  const factor = sort.direction === 'asc' ? 1 : -1;
  return orders.slice().sort((a, b) => {
    let comparison =
      sort.key === 'amount' ? a.total - b.total : a.date.localeCompare(b.date);
    if (comparison === 0) {
      comparison = a.orderNumber.localeCompare(b.orderNumber);
    }
    return comparison * factor;
  });
}

/**
 * Convenience helper: applies the status filter and then the sort. This is
 * the single entry point the orders screen uses.
 */
export function selectOrders(
  orders: Order[],
  status: OrderStatus | 'all',
  sort: OrderSort | null,
): Order[] {
  return sortOrders(filterOrdersByStatus(orders, status), sort);
}
