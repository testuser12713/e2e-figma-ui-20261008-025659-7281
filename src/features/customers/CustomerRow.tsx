import type { Customer, CustomerStatus } from '../../types/models';
import { CUSTOMER_STATUS_LABELS } from './filterCustomers';
import styles from './CustomerListScreen.module.css';

interface CustomerRowProps {
  customer: Customer;
  onSelect: (customer: Customer) => void;
}

const statusBadgeClass: Record<CustomerStatus, string> = {
  active: styles.badgeSuccess,
  pending: styles.badgeInfo,
  inactive: styles.badgeNeutral,
};

/**
 * A single customer list row. It is a real <button>, so it is reachable with
 * Tab and opens with Enter/Space (AC-12); the focus ring comes from the module
 * styles.
 */
export default function CustomerRow({ customer, onSelect }: CustomerRowProps) {
  return (
    <button
      type="button"
      className={`${styles.row} ${styles.cols}`}
      data-testid="customer-row"
      data-od-id={`customer-row-${customer.id}`}
      onClick={() => onSelect(customer)}
    >
      <span className={`${styles.cell} ${styles.cellStrong}`} data-label="Kunde">
        {customer.name}
      </span>
      <span className={styles.cell} data-label="Unternehmen">
        {customer.company}
      </span>
      <span className={`${styles.cell} ${styles.cellMono}`} data-label="E-Mail">
        {customer.email}
      </span>
      <span className={styles.cell} data-label="Stadt">
        {customer.city}
      </span>
      <span className={`${styles.cell} ${styles.cellStatus}`} data-label="Status">
        <span className={`${styles.badge} ${statusBadgeClass[customer.status]}`}>
          {CUSTOMER_STATUS_LABELS[customer.status]}
        </span>
      </span>
    </button>
  );
}
