import { NavLink } from 'react-router-dom';
import styles from './Nav.module.css';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/customers', label: 'Customers' },
  { to: '/orders', label: 'Orders' },
];

export function Nav() {
  return (
    <nav className={styles.nav} aria-label="Hauptnavigation">
      <span className={styles.wordmark}>BusinessHandler</span>
      <ul className={styles.items}>
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? `${styles.item} ${styles.itemActive}` : styles.item
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
