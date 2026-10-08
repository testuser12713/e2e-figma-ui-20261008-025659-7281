export type CustomerStatus = 'active' | 'inactive' | 'pending';

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  status: CustomerStatus;
  createdAt: string;
  totalRevenue: number;
}

export type OrderStatus = 'open' | 'paid' | 'shipped' | 'overdue' | 'cancelled';

export interface OrderLine {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  date: string;
  status: OrderStatus;
  lines: OrderLine[];
  subtotal: number;
  vat: number;
  total: number;
}

export type ActivityKind = 'order' | 'customer' | 'invoice';

export interface ActivityEntry {
  id: string;
  date: string;
  kind: ActivityKind;
  text: string;
}
