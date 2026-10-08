import type { Customer, CustomerStatus } from '../../types/models';

export type CustomerSortColumn = 'name' | 'company' | 'email' | 'city' | 'status';

export type SortDirection = 'asc' | 'desc';

/**
 * German display labels for the customer status enum, aligned with DESIGN.md:
 * active = Aktiv, pending = Neu, at_risk = Gefährdet, inactive = Inaktiv.
 */
export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  active: 'Aktiv',
  pending: 'Neu',
  at_risk: 'Gefährdet',
  inactive: 'Inaktiv',
};

function matchesQuery(customer: Customer, query: string): boolean {
  const haystack = [customer.name, customer.company, customer.email, customer.city]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

/**
 * Substring search over name, company, e-mail and city, combined with an
 * optional status filter. The search is case-insensitive and ignores
 * surrounding whitespace; an empty query keeps every row.
 */
export function filterCustomers(
  customers: Customer[],
  search: string,
  status: CustomerStatus | 'all',
): Customer[] {
  const query = search.trim().toLowerCase();
  return customers.filter((customer) => {
    if (status !== 'all' && customer.status !== status) {
      return false;
    }
    if (query.length === 0) {
      return true;
    }
    return matchesQuery(customer, query);
  });
}

function sortValue(customer: Customer, column: CustomerSortColumn): string {
  if (column === 'status') {
    return CUSTOMER_STATUS_LABELS[customer.status];
  }
  return customer[column];
}

/**
 * Returns a new, sorted array. Sorting by a string column uses the German
 * locale; a status column sorts by its German display label. The input array
 * is never mutated.
 */
export function sortCustomers(
  customers: Customer[],
  column: CustomerSortColumn,
  direction: SortDirection,
): Customer[] {
  const factor = direction === 'asc' ? 1 : -1;
  return [...customers].sort((left, right) => {
    const a = sortValue(left, column);
    const b = sortValue(right, column);
    return a.localeCompare(b, 'de', { sensitivity: 'base' }) * factor;
  });
}

/**
 * The single entry point the screen uses: filter first, then sort. Keeping it
 * pure makes the whole list behaviour testable without rendering.
 */
export function selectCustomers(
  customers: Customer[],
  search: string,
  status: CustomerStatus | 'all',
  column: CustomerSortColumn,
  direction: SortDirection,
): Customer[] {
  return sortCustomers(filterCustomers(customers, search, status), column, direction);
}
