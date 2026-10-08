import {
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { OrderStatus } from '../../types/models';
import { orders } from '../../data/orders';
import { customers } from '../../data/customers';
import { useFilters } from '../../state/FilterContext';
import { OrderRow, ORDER_STATUS_LABELS } from './OrderRow';
import {
  selectOrders,
  type OrderSort,
  type OrderSortKey,
} from './filterOrders';
import styles from './OrderListScreen.module.css';

const STATUS_ORDER: OrderStatus[] = [
  'open',
  'paid',
  'shipped',
  'overdue',
  'cancelled',
];

interface ChipOption {
  value: OrderStatus | 'all';
  label: string;
  count: number;
}

export default function OrderListScreen() {
  const { orderStatus, setOrderStatus } = useFilters();
  const navigate = useNavigate();
  const [sort, setSort] = useState<OrderSort>({ key: 'date', direction: 'desc' });
  const [focusIndex, setFocusIndex] = useState(0);
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const customerNames = useMemo(() => {
    const names = new Map<string, string>();
    for (const customer of customers) {
      names.set(customer.id, customer.name);
    }
    return names;
  }, []);

  const chips = useMemo<ChipOption[]>(() => {
    const counts = new Map<OrderStatus, number>();
    for (const order of orders) {
      counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
    }
    return [
      { value: 'all', label: 'Alle', count: orders.length },
      ...STATUS_ORDER.map((status) => ({
        value: status,
        label: ORDER_STATUS_LABELS[status],
        count: counts.get(status) ?? 0,
      })),
    ];
  }, []);

  const visibleOrders = useMemo(
    () => selectOrders(orders, orderStatus, sort),
    [orderStatus, sort],
  );

  function toggleSort(key: OrderSortKey) {
    setSort((previous) =>
      previous.key === key
        ? {
            key,
            direction: previous.direction === 'asc' ? 'desc' : 'asc',
          }
        : { key, direction: 'asc' },
    );
  }

  function sortLabel(label: string, key: OrderSortKey) {
    if (sort.key !== key) {
      return `Nach ${label} sortieren`;
    }
    return sort.direction === 'asc'
      ? `${label}: aufsteigend sortiert`
      : `${label}: absteigend sortiert`;
  }

  function sortIndicator(key: OrderSortKey) {
    if (sort.key !== key) {
      return '';
    }
    return sort.direction === 'asc' ? '\u2191' : '\u2193';
  }

  function handleChipKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const { key } = event;
    const lastIndex = chips.length - 1;
    let nextIndex: number | null = null;

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      nextIndex = index === lastIndex ? 0 : index + 1;
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      nextIndex = index === 0 ? lastIndex : index - 1;
    } else if (key === 'Home') {
      nextIndex = 0;
    } else if (key === 'End') {
      nextIndex = lastIndex;
    }

    if (nextIndex === null) {
      return;
    }
    event.preventDefault();
    setFocusIndex(nextIndex);
    chipRefs.current[nextIndex]?.focus();
  }

  const emptyMessage =
    orderStatus === 'all'
      ? 'Es sind keine Aufträge vorhanden.'
      : `Keine Aufträge für Status ${ORDER_STATUS_LABELS[orderStatus]}.`;

  return (
    <section className={styles.screen} aria-label="Aufträge">
      <div>
        <header className={styles.pageHeader} data-od-id="page-header">
          <div>
            <h1 className={styles.title} data-od-id="page-title">
              Aufträge
            </h1>
            <p className={styles.subtitle}>{orders.length} Aufträge insgesamt.</p>
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonSecondary}`}
              data-od-id="btn-export"
              disabled
              aria-disabled="true"
              title="Der CSV-Export ist im Prototyp noch nicht verfügbar."
            >
              <svg
                className={styles.buttonIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Export
            </button>
            <span className={styles.comingSoon}>Coming soon</span>
          </div>
        </header>

        <div className={styles.toolbar} data-od-id="toolbar">
          <div
            className={styles.chips}
            role="group"
            aria-label="Nach Status filtern"
            data-od-id="status-chips"
          >
            {chips.map((chip, index) => {
              const selected = chip.value === orderStatus;
              return (
                <button
                  key={chip.value}
                  ref={(element) => {
                    chipRefs.current[index] = element;
                  }}
                  type="button"
                  className={styles.chip}
                  data-od-id={chip.value === 'all' ? 'chip-alle' : `chip-${chip.value}`}
                  data-status={chip.value}
                  aria-pressed={selected}
                  aria-label={`${chip.label} (${chip.count})`}
                  tabIndex={index === focusIndex ? 0 : -1}
                  onClick={() => {
                    setFocusIndex(index);
                    setOrderStatus(chip.value);
                  }}
                  onKeyDown={(event) => handleChipKeyDown(event, index)}
                >
                  {chip.label}
                  <span className={styles.chipCount} aria-hidden="true">
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.list} data-od-id="order-list">
        {visibleOrders.length === 0 ? (
          <div className={styles.empty} data-od-id="empty-state">
            <svg
              className={styles.emptyIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <h2 className={styles.emptyTitle}>Keine Aufträge gefunden</h2>
            <p className={styles.emptyBody}>{emptyMessage}</p>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={() => setOrderStatus('all')}
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <>
            <div className={`${styles.tableHead} ${styles.colsOrders}`}>
              <div className={styles.headCell}>Auftrag</div>
              <div className={styles.headCell}>Kunde</div>
              <div className={styles.headCell}>
                <button
                  type="button"
                  className={styles.sortButton}
                  aria-label={sortLabel('Datum', 'date')}
                  onClick={() => toggleSort('date')}
                >
                  Datum
                  <span className={styles.sortIcon} aria-hidden="true">
                    {sortIndicator('date')}
                  </span>
                </button>
              </div>
              <div className={`${styles.headCell} ${styles.headCellNum}`}>
                <button
                  type="button"
                  className={styles.sortButton}
                  aria-label={sortLabel('Betrag', 'amount')}
                  onClick={() => toggleSort('amount')}
                >
                  Betrag
                  <span className={styles.sortIcon} aria-hidden="true">
                    {sortIndicator('amount')}
                  </span>
                </button>
              </div>
              <div className={styles.headCell}>Status</div>
              <div className={styles.headCell} />
            </div>

            {visibleOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                customerName={customerNames.get(order.customerId) ?? order.customerId}
                onOpen={(id) => navigate(`/orders/${id}`)}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
