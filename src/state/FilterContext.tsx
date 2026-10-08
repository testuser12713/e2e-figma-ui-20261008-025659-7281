import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CustomerStatus, OrderStatus } from '../types/models';

export interface FilterState {
  customerSearch: string;
  setCustomerSearch: (value: string) => void;
  customerStatus: CustomerStatus | 'all';
  setCustomerStatus: (value: CustomerStatus | 'all') => void;
  orderStatus: OrderStatus | 'all';
  setOrderStatus: (value: OrderStatus | 'all') => void;
}

const FilterContext = createContext<FilterState | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatus, setCustomerStatus] = useState<CustomerStatus | 'all'>('all');
  const [orderStatus, setOrderStatus] = useState<OrderStatus | 'all'>('all');

  const value = useMemo<FilterState>(
    () => ({
      customerSearch,
      setCustomerSearch,
      customerStatus,
      setCustomerStatus,
      orderStatus,
      setOrderStatus,
    }),
    [customerSearch, customerStatus, orderStatus],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters(): FilterState {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
