import { Link, useParams } from 'react-router-dom';
import { customers } from '../../data/customers';
import { orders } from '../../data/orders';
import { formatCurrencyEUR, formatDateDE } from '../../lib/format';
import { NotFoundScreen } from '../shell/NotFoundScreen';
import type { CustomerStatus, OrderStatus } from '../../types/models';
import styles from './CustomerDetailScreen.module.css';

const customerStatusLabels: Record<CustomerStatus, string> = {
  active: 'Aktiv',
  pending: 'Neu',
  at_risk: 'Gefährdet',
  inactive: 'Inaktiv',
};

const customerStatusClasses: Record<CustomerStatus, string> = {
  active: styles.badgeSuccess,
  pending: styles.badgeInfo,
  at_risk: styles.badgeWarning,
  inactive: styles.badgeNeutral,
};

const orderStatusLabels: Record<OrderStatus, string> = {
  open: 'Offen',
  paid: 'Bezahlt',
  overdue: 'Überfällig',
  cancelled: 'Storniert',
};

const orderStatusClasses: Record<OrderStatus, string> = {
  open: styles.badgeWarning,
  paid: styles.badgeSuccess,
  overdue: styles.badgeDanger,
  cancelled: styles.badgeNeutral,
};

export function CustomerDetailScreen() {
  const { customerId } = useParams<{ customerId: string }>();
  const customer = customers.find((entry) => entry.id === customerId);

  if (customer === undefined) {
    return <NotFoundScreen />;
  }

  const customerOrders = orders
    .filter((order) => order.customerId === customer.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const averageOrderValue =
    customerOrders.length > 0 ? customer.totalRevenue / customerOrders.length : 0;

  return (
    <section className={styles.screen} aria-labelledby="customer-detail-title">
      <Link to="/customers" className={styles.backLink} data-od-id="back-to-list">
        <span aria-hidden="true" className={styles.backArrow}>
          ←
        </span>
        Zurück zur Liste
      </Link>

      <header className={styles.header} data-od-id="detail-header">
        <h1 id="customer-detail-title" className={styles.title} data-od-id="detail-title">
          {customer.name}
        </h1>
        <p className={styles.subtitle}>{customer.company}</p>
      </header>

      <section className={styles.card} aria-label="Kundendaten" data-od-id="customer-meta">
        <dl className={styles.metaGrid}>
          <div className={styles.metaItem} data-od-id="meta-id">
            <dt className={styles.metaLabel}>Kunden-ID</dt>
            <dd className={styles.metaValue}>
              <span className={styles.mono}>{customer.id}</span>
            </dd>
          </div>
          <div className={styles.metaItem} data-od-id="meta-status">
            <dt className={styles.metaLabel}>Status</dt>
            <dd className={styles.metaValue}>
              <span className={customerStatusClasses[customer.status]}>
                {customerStatusLabels[customer.status]}
              </span>
            </dd>
          </div>
          <div className={styles.metaItem} data-od-id="meta-email">
            <dt className={styles.metaLabel}>E-Mail</dt>
            <dd className={styles.metaValue}>
              <span className={styles.mono}>{customer.email}</span>
            </dd>
          </div>
          <div className={styles.metaItem} data-od-id="meta-phone">
            <dt className={styles.metaLabel}>Telefon</dt>
            <dd className={styles.metaValue}>{customer.phone}</dd>
          </div>
          <div className={styles.metaItem} data-od-id="meta-address">
            <dt className={styles.metaLabel}>Adresse</dt>
            <dd className={styles.metaValue}>{customer.city}</dd>
          </div>
          <div className={styles.metaItem} data-od-id="meta-since">
            <dt className={styles.metaLabel}>Kunde seit</dt>
            <dd className={styles.metaValue}>{formatDateDE(customer.createdAt)}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="customer-kpis-title" data-od-id="customer-kpis">
        <h2 id="customer-kpis-title" className={styles.sectionTitle}>
          Kennzahlen
        </h2>
        <div className={styles.kpiGrid}>
          <article className={styles.kpiCard} data-od-id="kpi-total-revenue">
            <div className={styles.kpiLabel}>Gesamtumsatz</div>
            <div className={styles.kpiValue}>{formatCurrencyEUR(customer.totalRevenue)}</div>
          </article>
          <article className={styles.kpiCard} data-od-id="kpi-order-count">
            <div className={styles.kpiLabel}>Aufträge</div>
            <div className={styles.kpiValue}>{customerOrders.length}</div>
          </article>
          <article className={styles.kpiCard} data-od-id="kpi-avg-value">
            <div className={styles.kpiLabel}>Ø Auftragswert</div>
            <div className={styles.kpiValue}>{formatCurrencyEUR(averageOrderValue)}</div>
          </article>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="customer-history-title" data-od-id="order-history">
        <h2 id="customer-history-title" className={styles.sectionTitle}>
          Auftragshistorie
        </h2>
        {customerOrders.length === 0 ? (
          <p className={styles.emptyHistory}>Für diesen Kunden liegen noch keine Aufträge vor.</p>
        ) : (
          <div className={styles.table} data-od-id="order-history-list">
            <div className={styles.tableHead}>
              <span>Auftrag</span>
              <span>Datum</span>
              <span className={styles.cellNum}>Betrag</span>
              <span>Status</span>
              <span aria-hidden="true" />
            </div>
            <div className={styles.tableBody}>
              {customerOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className={styles.tableRow}
                  aria-label={`Auftrag ${order.orderNumber} öffnen`}
                >
                  <span className={styles.orderNumber} data-label="Auftrag">
                    {order.orderNumber}
                  </span>
                  <span data-label="Datum">{formatDateDE(order.date)}</span>
                  <span className={styles.cellNum} data-label="Betrag">
                    {formatCurrencyEUR(order.total)}
                  </span>
                  <span data-label="Status">
                    <span className={orderStatusClasses[order.status]}>
                      {orderStatusLabels[order.status]}
                    </span>
                  </span>
                  <span className={styles.chevron} aria-hidden="true">
                    ›
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </section>
  );
}

export default CustomerDetailScreen;
