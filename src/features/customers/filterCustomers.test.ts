import { describe, expect, it } from 'vitest';
import { customers } from '../../data/customers';
import {
  CUSTOMER_STATUS_LABELS,
  filterCustomers,
  selectCustomers,
  sortCustomers,
} from './filterCustomers';

describe('filterCustomers', () => {
  it('keeps every customer when the search is empty and the status is all', () => {
    expect(filterCustomers(customers, '', 'all')).toHaveLength(customers.length);
    expect(filterCustomers(customers, '   ', 'all')).toHaveLength(customers.length);
  });

  it('matches a substring of name, company, e-mail or city case-insensitively', () => {
    expect(filterCustomers(customers, 'meier', 'all').map((c) => c.name)).toContain(
      'Anna Meier',
    );

    const byCompany = filterCustomers(customers, 'nordwind', 'all');
    expect(byCompany).toHaveLength(1);
    expect(byCompany[0]?.id).toBe('C-001');

    const byEmail = filterCustomers(customers, 'POLARISSOFTWARE', 'all');
    expect(byEmail).toHaveLength(1);
    expect(byEmail[0]?.name).toBe('Paul Zimmermann');

    const byCity = filterCustomers(customers, 'hamburg', 'all');
    expect(byCity).toHaveLength(1);
    expect(byCity[0]?.name).toBe('Bernd Schmidt');
  });

  it('keeps only customers with the requested status', () => {
    const pending = filterCustomers(customers, '', 'pending');
    expect(pending.length).toBeGreaterThan(0);
    expect(pending.every((c) => c.status === 'pending')).toBe(true);

    const inactive = filterCustomers(customers, '', 'inactive');
    expect(inactive.length).toBeGreaterThan(0);
    expect(inactive.every((c) => c.status === 'inactive')).toBe(true);
  });

  it('combines the search with the status filter', () => {
    const result = filterCustomers(customers, 'meier', 'active');
    expect(result.every((c) => c.status === 'active')).toBe(true);
    expect(result.every((c) => /meier/i.test(`${c.name} ${c.company} ${c.email} ${c.city}`))).toBe(
      true,
    );
  });
});

describe('sortCustomers', () => {
  it('sorts by name ascending and descending without mutating the input', () => {
    const originalIds = customers.map((c) => c.id);

    const ascending = sortCustomers(customers, 'name', 'asc').map((c) => c.name);
    const descending = sortCustomers(customers, 'name', 'desc').map((c) => c.name);

    expect(ascending[0]).toBe('Anna Meier');
    expect(descending).toEqual([...ascending].reverse());
    expect(customers.map((c) => c.id)).toEqual(originalIds);
  });

  it('sorts a numeric-free status column by its German label', () => {
    const labels = sortCustomers(customers, 'status', 'asc').map(
      (c) => CUSTOMER_STATUS_LABELS[c.status],
    );
    expect(labels).toEqual(
      [...labels].sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' })),
    );
  });
});

describe('selectCustomers', () => {
  it('applies search, status and sort together', () => {
    const result = selectCustomers(customers, 'nord', 'active', 'name', 'asc');
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('Anna Meier');
  });

  it('returns an empty array when nothing matches', () => {
    expect(selectCustomers(customers, 'zzz-no-match', 'all', 'name', 'asc')).toEqual([]);
  });
});
