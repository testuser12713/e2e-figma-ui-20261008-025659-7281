import KpiCard from './KpiCard';
import RevenueChart from './RevenueChart';
import ActivityList from './ActivityList';
import { activity } from '../../data/activity';
import { formatCurrencyEUR, formatDateDE } from '../../lib/format';
import {
  averageOrderValue,
  averageOrderValueDelta,
  countOpenOrders,
  currentMonthRevenue,
  monthlyRevenueSeries,
  newCustomersDelta,
  newCustomersThisMonth,
  openOrdersDelta,
  revenueDelta,
} from './dashboardMetrics';
import styles from './DashboardScreen.module.css';

export default function DashboardScreen() {
  const revenueSeries = monthlyRevenueSeries();
  const monthRevenue = currentMonthRevenue();
  const openOrders = countOpenOrders();
  const newCustomers = newCustomersThisMonth();
  const averageOrder = averageOrderValue();
  const recentActivity = activity.slice(0, 6);
  const latestActivityDate = recentActivity.length > 0 ? recentActivity[0].date : '';

  return (
    <section className={styles.screen} aria-labelledby="dashboard-title">
      <header className={styles.pageHeader}>
        <div>
          <h1 id="dashboard-title" className={styles.pageTitle}>
            Dashboard
          </h1>
          <p className={styles.pageSubtitle}>Überblick über Umsatz, Aufträge und Kunden.</p>
        </div>
      </header>

      <section className={styles.kpiGrid} aria-label="Kennzahlen">
        <KpiCard
          region="kpi-revenue"
          label="Umsatz (Monat)"
          value={formatCurrencyEUR(monthRevenue)}
          delta={revenueDelta()}
        />
        <KpiCard
          region="kpi-open-orders"
          label="Offene Aufträge"
          value={String(openOrders)}
          delta={openOrdersDelta()}
        />
        <KpiCard
          region="kpi-new-customers"
          label="Neue Kunden"
          value={String(newCustomers)}
          delta={newCustomersDelta()}
        />
        <KpiCard
          region="kpi-avg-order"
          label="Ø Auftragswert"
          value={formatCurrencyEUR(averageOrder)}
          delta={averageOrderValueDelta()}
        />
      </section>

      <div className={styles.dashGrid}>
        <section
          id="revenue-chart-card"
          data-od-id="revenue-chart-card"
          className={styles.card}
          aria-labelledby="revenue-chart-title"
        >
          <h2 id="revenue-chart-title" className={styles.cardTitle}>
            Umsatzentwicklung
          </h2>
          <p className={styles.cardSubtitle}>Letzte 12 Monate</p>
          <RevenueChart data={revenueSeries} />
        </section>

        <section
          id="activity-card"
          data-od-id="activity-card"
          className={styles.card}
          aria-labelledby="activity-title"
        >
          <h2 id="activity-title" className={styles.cardTitle}>
            Letzte Aktivitäten
          </h2>
          {latestActivityDate ? (
            <p className={styles.cardSubtitle}>
              Zuletzt aktualisiert am {formatDateDE(latestActivityDate)}
            </p>
          ) : null}
          <ActivityList entries={recentActivity} />
        </section>
      </div>
    </section>
  );
}
