import { Link, useParams } from 'react-router-dom';
import { customers } from '../../data/customers';
import { orders } from '../../data/orders';
import { formatCurrencyEUR, formatDateDE } from '../../lib/format';
import type { OrderStatus } from '../../types/models';
import { NotFoundScreen } from '../shell/NotFoundScreen';
import styles from './OrderDetailScreen.module.css';

const statusLabels: Record<OrderStatus, string> = {
  open: 'Offen',
  paid: 'Bezahlt',
  overdue: 'Überfällig',
  cancelled: 'Storniert',
};

const statusTone: Record<OrderStatus, string> = {
  open: 'badgeOpen',
  paid: 'badgePaid',
  overdue: 'badgeOverdue',
  cancelled: 'badgeCancelled',
};

const PAYMENT_METHOD = 'Überweisung';

export default function OrderDetailScreen() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orders.find((entry) => entry.id === orderId);

  if (order === undefined) {
    return <NotFoundScreen />;
  }

  const customer = customers.find((entry) => entry.id === order.customerId);

  return (
    <div className={styles.page}>
      <Link className={styles.backLink} to="/orders" data-od-id="back-to-list">
        <span className={styles.backArrow} aria-hidden="true">
          ←
        </span>
        Zurück zur Liste
      </Link>

      <header data-od-id="detail-header">
        <h1 className={styles.title} data-od-id="detail-title">
          Auftrag <span className={styles.mono}>{order.orderNumber}</span>
        </h1>
        {customer !== undefined && (
          <p className={styles.subtitle}>
            {customer.name} · {customer.company}
          </p>
        )}
      </header>

      <section className={`${styles.card} ${styles.metaCard}`} aria-label="Auftragsdaten" data-od-id="order-meta">
        <dl className={styles.metaGrid}>
          <div className={styles.metaItem} data-od-id="meta-order-id">
            <dt className={styles.metaLabel}>Auftragsnummer</dt>
            <dd className={styles.metaValue}>
              <span className={styles.mono}>{order.orderNumber}</span>
            </dd>
          </div>
          <div className={styles.metaItem} data-od-id="meta-status">
            <dt className={styles.metaLabel}>Status</dt>
            <dd className={styles.metaValue}>
              <span className={`${styles.badge} ${styles[statusTone[order.status]]}`}>
                {statusLabels[order.status]}
              </span>
            </dd>
          </div>
          <div className={styles.metaItem} data-od-id="meta-date">
            <dt className={styles.metaLabel}>Datum</dt>
            <dd className={styles.metaValue}>{formatDateDE(order.date)}</dd>
          </div>
          <div className={styles.metaItem} data-od-id="meta-payment">
            <dt className={styles.metaLabel}>Zahlungsart</dt>
            <dd className={styles.metaValue}>{PAYMENT_METHOD}</dd>
          </div>
          <div className={styles.metaItem} data-od-id="meta-customer">
            <dt className={styles.metaLabel}>Kunde</dt>
            <dd className={styles.metaValue}>{customer?.name ?? '—'}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-label="Positionen" data-od-id="line-items">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Positionen</h2>
          <div className={styles.invoiceAction}>
            <button
              type="button"
              className={styles.button}
              disabled
              aria-disabled="true"
              data-od-id="btn-invoice"
            >
              Rechnung herunterladen
            </button>
            <span className={styles.comingSoon}>Coming soon</span>
          </div>
        </div>
        <div className={styles.list}>
          <div className={`${styles.row} ${styles.tableHead}`}>
            <div>Artikel</div>
            <div className={styles.cellNum}>Menge</div>
            <div className={styles.cellNum}>Einzelpreis</div>
            <div className={styles.cellNum}>Gesamt</div>
          </div>
          {order.lines.map((line, index) => (
            <div
              key={`${line.description}-${index}`}
              className={styles.row}
              data-od-id={`line-item-${index + 1}`}
            >
              <div className={styles.cell} data-label="Artikel">
                {line.description}
              </div>
              <div className={`${styles.cell} ${styles.cellNum}`} data-label="Menge">
                {line.quantity}
              </div>
              <div className={`${styles.cell} ${styles.cellNum}`} data-label="Einzelpreis">
                {formatCurrencyEUR(line.unitPrice)}
              </div>
              <div className={`${styles.cell} ${styles.cellNum}`} data-label="Gesamt">
                {formatCurrencyEUR(line.quantity * line.unitPrice)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-label="Summen" data-od-id="order-totals">
        <h2 className={styles.sectionTitle}>Summen</h2>
        <div className={`${styles.card} ${styles.totalsCard}`}>
          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Zwischensumme</span>
              <span className={styles.value}>{formatCurrencyEUR(order.subtotal)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>zzgl. 19{'\u00A0'}% MwSt.</span>
              <span className={styles.value}>{formatCurrencyEUR(order.vat)}</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grand}`}>
              <span>Gesamt</span>
              <span className={styles.value}>{formatCurrencyEUR(order.total)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
