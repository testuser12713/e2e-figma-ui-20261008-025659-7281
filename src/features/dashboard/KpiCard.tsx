import styles from './DashboardScreen.module.css';

interface KpiCardProps {
  label: string;
  value: string;
  region: string;
}

export default function KpiCard({ label, value, region }: KpiCardProps) {
  return (
    <article id={region} data-od-id={region} className={styles.card}>
      <p className={styles.kpiLabel}>{label}</p>
      <p className={styles.kpiValue}>{value}</p>
    </article>
  );
}
