import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { NotFoundScreen } from './features/shell/NotFoundScreen';
import DashboardScreen from './features/dashboard/DashboardScreen';
import CustomerListScreen from './features/customers/CustomerListScreen';
import CustomerDetailScreen from './features/customers/CustomerDetailScreen';
import OrderListScreen from './features/orders/OrderListScreen';
import OrderDetailScreen from './features/orders/OrderDetailScreen';
import { FilterProvider } from './state/FilterContext';

export default function App() {
  return (
    <FilterProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardScreen />} />
            <Route path="/customers" element={<CustomerListScreen />} />
            <Route path="/customers/:customerId" element={<CustomerDetailScreen />} />
            <Route path="/orders" element={<OrderListScreen />} />
            <Route path="/orders/:orderId" element={<OrderDetailScreen />} />
            <Route path="*" element={<NotFoundScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FilterProvider>
  );
}
