import type { KpiDelta } from './dashboardMetrics';
import styles from './DashboardScreen.module.css';

const DELTA_ARROWS: Record<KpiDelta['direction'], string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};

const DELTA_CLASSNAMES: Record<KpiDelta['direction'], string> = {
  up: styles.kpiDeltaUp,
  down: styles.kpiDeltaDown,
  flat: styles.kpiDeltaFlat,
};

interface KpiCardProps {
  label: string;
  value: string;
  region: string;
  delta?: KpiDelta;
}

export default function KpiCard({ label, value, region, delta }: KpiCardProps) {
  return (
    <article id={region} data-od-id={region} className={styles.card}>
      <p className={styles.kpiLabel}>{label}</p>
      <p className={styles.kpiValue}>{value}</p>
      {delta ? (
        <p className={`${styles.kpiDelta} ${DELTA_CLASSNAMES[delta.direction]}`}>
          <span className={styles.kpiDeltaArrow} aria-hidden="true">
            {DELTA_ARROWS[delta.direction]}
          </span>
          <span>{delta.text}</span>
        </p>
      ) : null}
      {delta?.note ? <p className={styles.kpiNote}>{delta.note}</p> : null}
    </article>
  );
}
