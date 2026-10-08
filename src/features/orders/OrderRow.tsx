import type { Order, OrderStatus } from '../../types/models';
import { formatCurrencyEUR, formatDateDE } from '../../lib/format';
import styles from './OrderListScreen.module.css';

/**
 * German labels for the order statuses. DESIGN.md names Bezahlt, Offen,
 * Überfällig and Storniert; 'shipped' is added here because the shared
 * OrderStatus model carries it and the list must render one chip/badge per
 * status (AC-04).
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  open: 'Offen',
  paid: 'Bezahlt',
  shipped: 'Versandt',
  overdue: 'Überfällig',
  cancelled: 'Storniert',
};

const STATUS_TONE: Record<OrderStatus, string> = {
  open: styles.badgeWarning,
  paid: styles.badgeSuccess,
  shipped: styles.badgeInfo,
  overdue: styles.badgeDanger,
  cancelled: styles.badgeNeutral,
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`${styles.badge} ${STATUS_TONE[status]}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

interface OrderRowProps {
  order: Order;
  customerName: string;
  onOpen: (id: string) => void;
}

export function OrderRow({ order, customerName, onOpen }: OrderRowProps) {
  const rowId = order.orderNumber.replace(/^#/, '');

  return (
    <button
      type="button"
      className={`${styles.row} ${styles.colsOrders}`}
      data-od-id={`order-row-${rowId}`}
      aria-label={`Auftrag ${order.orderNumber} von ${customerName} öffnen`}
      onClick={() => onOpen(order.id)}
    >
      <span
        className={`${styles.cell} ${styles.cellMono} ${styles.cellStrong}`}
        data-label="Auftrag"
      >
        {order.orderNumber}
      </span>
      <span className={`${styles.cell} ${styles.rowName}`} data-label="Kunde">
        {customerName}
      </span>
      <span className={styles.cell} data-label="Datum">
        {formatDateDE(order.date)}
      </span>
      <span className={`${styles.cell} ${styles.cellNum}`} data-label="Betrag">
        {formatCurrencyEUR(order.total)}
      </span>
      <span className={`${styles.cell} ${styles.cellStatus}`} data-label="Status">
        <OrderStatusBadge status={order.status} />
      </span>
      <span
        className={`${styles.cell} ${styles.cellChevron}`}
        data-label=""
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </span>
    </button>
  );
}
