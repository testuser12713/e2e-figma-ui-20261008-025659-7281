import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { customers } from '../../data/customers';
import { useFilters } from '../../state/FilterContext';
import type { Customer, CustomerStatus } from '../../types/models';
import CustomerRow from './CustomerRow';
import {
  CUSTOMER_STATUS_LABELS,
  selectCustomers,
  type CustomerSortColumn,
  type SortDirection,
} from './filterCustomers';
import styles from './CustomerListScreen.module.css';

const CUSTOMER_STATUSES: CustomerStatus[] = ['active', 'pending', 'at_risk', 'inactive'];

const SORT_COLUMNS: { column: CustomerSortColumn; label: string }[] = [
  { column: 'name', label: 'Kunde' },
  { column: 'company', label: 'Unternehmen' },
  { column: 'email', label: 'E-Mail' },
  { column: 'city', label: 'Stadt' },
  { column: 'status', label: 'Status' },
];

interface SortState {
  column: CustomerSortColumn;
  direction: SortDirection;
}

export default function CustomerListScreen() {
  const navigate = useNavigate();
  const { customerSearch, setCustomerSearch, customerStatus, setCustomerStatus } = useFilters();
  const [sort, setSort] = useState<SortState>({ column: 'name', direction: 'asc' });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const visibleCustomers = useMemo(
    () =>
      selectCustomers(customers, customerSearch, customerStatus, sort.column, sort.direction),
    [customerSearch, customerStatus, sort],
  );

  const query = customerSearch.trim();
  const hasQuery = query.length > 0;

  const emptyMessage = useMemo(() => {
    const parts: string[] = [];
    if (hasQuery) {
      parts.push(`„${query}“`);
    }
    if (customerStatus !== 'all') {
      parts.push(`Status ${CUSTOMER_STATUS_LABELS[customerStatus]}`);
    }
    if (parts.length === 0) {
      return 'Es sind keine Kunden vorhanden.';
    }
    return `Keine Kunden für ${parts.join(' mit ')}.`;
  }, [hasQuery, query, customerStatus]);

  const toggleSort = useCallback((column: CustomerSortColumn) => {
    setSort((previous) =>
      previous.column === column
        ? { column, direction: previous.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' },
    );
  }, []);

  const clearSearch = useCallback(() => {
    setCustomerSearch('');
    searchInputRef.current?.focus();
  }, [setCustomerSearch]);

  const resetFilters = useCallback(() => {
    setCustomerSearch('');
    setCustomerStatus('all');
    searchInputRef.current?.focus();
  }, [setCustomerSearch, setCustomerStatus]);

  const handleChipKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const group = chipsRef.current;
    if (group === null) {
      return;
    }
    const chips = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-chip]'));
    const index = chips.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) {
      return;
    }
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % chips.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + chips.length) % chips.length;
    }
    if (nextIndex === null) {
      return;
    }
    event.preventDefault();
    chips[nextIndex]?.focus();
  };

  const statusOptions: { value: CustomerStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Alle' },
    ...CUSTOMER_STATUSES.map((status) => ({
      value: status,
      label: CUSTOMER_STATUS_LABELS[status],
    })),
  ];

  return (
    <section aria-labelledby="customers-title">
      <header className={styles.pageHeader} data-od-id="page-header">
        <div>
          <h1 id="customers-title" className={styles.pageTitle} data-od-id="page-title">
            Kunden
          </h1>
          <p className={styles.subtitle}>
            {customers.length} Kunden insgesamt.
          </p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            data-od-id="btn-new-customer"
            disabled
            aria-disabled="true"
          >
            <svg
              className={styles.btnIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Neuer Kunde
          </button>
          <span className={styles.comingSoon}>Coming soon</span>
        </div>
      </header>

      <div className={styles.toolbar} data-od-id="toolbar">
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="customer-search">
            Kunden durchsuchen
          </label>
          <div className={styles.search}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              id="customer-search"
              ref={searchInputRef}
              className={styles.searchInput}
              type="search"
              value={customerSearch}
              placeholder="Name, Unternehmen oder E-Mail…"
              autoComplete="off"
              onChange={(event) => setCustomerSearch(event.target.value)}
            />
            {hasQuery && (
              <button
                type="button"
                className={styles.searchClear}
                aria-label="Suche löschen"
                onClick={clearSearch}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div
          className={styles.chips}
          role="group"
          aria-label="Nach Status filtern"
          ref={chipsRef}
          onKeyDown={handleChipKeyDown}
        >
          {statusOptions.map((option) => {
            const selected = customerStatus === option.value;
            return (
              <button
                key={option.value}
                type="button"
                data-chip
                data-od-id={option.value === 'all' ? 'chip-alle' : `chip-${option.value}`}
                className={styles.chip}
                aria-pressed={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setCustomerStatus(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {visibleCustomers.length === 0 ? (
        <div className={styles.empty} data-od-id="empty-state">
          <svg
            className={styles.emptyIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <h2 className={styles.emptyTitle}>Keine Kunden gefunden</h2>
          <p className={styles.emptyText}>{emptyMessage}</p>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary} ${styles.resetButton}`}
            onClick={resetFilters}
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className={styles.list} data-od-id="customer-list">
          <div className={`${styles.tableHead} ${styles.cols}`} role="row">
            {SORT_COLUMNS.map(({ column, label }) => {
              const active = sort.column === column;
              const ariaSort = active
                ? sort.direction === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none';
              return (
                <div
                  key={column}
                  className={styles.headCell}
                  role="columnheader"
                  aria-sort={ariaSort}
                >
                  <button
                    type="button"
                    className={styles.headButton}
                    onClick={() => toggleSort(column)}
                  >
                    {label}
                    <span className={styles.sortIndicator} aria-hidden="true">
                      {active ? (sort.direction === 'asc' ? '▲' : '▼') : ''}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          {visibleCustomers.map((customer: Customer) => (
            <CustomerRow
              key={customer.id}
              customer={customer}
              onSelect={(selected) => navigate(`/customers/${selected.id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
