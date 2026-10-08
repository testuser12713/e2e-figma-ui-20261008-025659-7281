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
  orderSearch: string;
  setOrderSearch: (value: string) => void;
  orderStatus: OrderStatus | 'all';
  setOrderStatus: (value: OrderStatus | 'all') => void;
}

const FilterContext = createContext<FilterState | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatus, setCustomerStatus] = useState<CustomerStatus | 'all'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState<OrderStatus | 'all'>('all');

  const value = useMemo<FilterState>(
    () => ({
      customerSearch,
      setCustomerSearch,
      customerStatus,
      setCustomerStatus,
      orderSearch,
      setOrderSearch,
      orderStatus,
      setOrderStatus,
    }),
    [customerSearch, customerStatus, orderSearch, orderStatus],
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
