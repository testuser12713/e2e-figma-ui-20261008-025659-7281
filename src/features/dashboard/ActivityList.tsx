import type { ActivityEntry, ActivityKind } from '../../types/models';
import { formatDateDE } from '../../lib/format';
import styles from './DashboardScreen.module.css';

interface ActivityListProps {
  entries: ActivityEntry[];
}

function dotClass(kind: ActivityKind): string {
  switch (kind) {
    case 'customer':
    case 'order':
      return styles.dotAccent;
    case 'invoice':
      return styles.dotSuccess;
    default:
      return styles.dotNeutral;
  }
}

export default function ActivityList({ entries }: ActivityListProps) {
  if (entries.length === 0) {
    return <p className={styles.activitySub}>Keine Aktivitäten vorhanden.</p>;
  }

  return (
    <ol className={styles.activity} aria-label="Aktivitäten">
      {entries.map((entry) => (
        <li key={entry.id} className={styles.activityRow} data-od-id={`activity-${entry.id}`}>
          <span
            className={`${styles.activityDot} ${dotClass(entry.kind)}`}
            aria-hidden="true"
          />
          <div className={styles.activityBody}>
            <p className={styles.activityLine}>{entry.text}</p>
            <p className={styles.activitySub}>{formatDateDE(entry.date)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
