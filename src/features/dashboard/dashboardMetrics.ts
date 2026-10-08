import type { ActivityEntry, Order } from '../../types/models';
import { activity } from '../../data/activity';
import { customers } from '../../data/customers';
import { orders } from '../../data/orders';

const MONTH_NAMES_DE = [
  'Jan',
  'Feb',
  'Mär',
  'Apr',
  'Mai',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dez',
] as const;

export interface RevenuePoint {
  month: string;
  label: string;
  revenue: number;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function monthKey(iso: string): string {
  return iso.length >= 7 ? iso.slice(0, 7) : iso;
}

export function monthLabelDe(month: string): string {
  const monthNumber = Number(month.slice(5, 7));
  return MONTH_NAMES_DE[monthNumber - 1] ?? month;
}

export function latestMonth(dates: string[]): string {
  return dates.reduce((latest, date) => {
    const key = monthKey(date);
    return key > latest ? key : latest;
  }, '0000-00');
}

export const REFERENCE_MONTH = latestMonth([
  ...orders.map((order) => order.date),
  ...customers.map((customer) => customer.createdAt),
  ...activity.map((entry) => entry.date),
]);

function addMonths(month: string, delta: number): string {
  const year = Number(month.slice(0, 4));
  const monthIndex = Number(month.slice(5, 7)) - 1 + delta;
  const shifted = new Date(Date.UTC(year, monthIndex, 1));
  const shiftedMonth = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  return `${shifted.getUTCFullYear()}-${shiftedMonth}`;
}

export function monthlyRevenueSeries(
  orderList: Order[] = orders,
  count = 12,
  endMonth: string = REFERENCE_MONTH,
): RevenuePoint[] {
  const totalsByMonth = new Map<string, number>();
  for (const order of orderList) {
    const key = monthKey(order.date);
    totalsByMonth.set(key, (totalsByMonth.get(key) ?? 0) + order.total);
  }

  const points: RevenuePoint[] = [];
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const month = addMonths(endMonth, -offset);
    points.push({
      month,
      label: monthLabelDe(month),
      revenue: round2(totalsByMonth.get(month) ?? 0),
    });
  }
  return points;
}

export function currentMonthRevenue(
  orderList: Order[] = orders,
  month: string = REFERENCE_MONTH,
): number {
  const total = orderList
    .filter((order) => monthKey(order.date) === month)
    .reduce((sum, order) => sum + order.total, 0);
  return round2(total);
}

export function countOpenOrders(orderList: Order[] = orders): number {
  return orderList.filter((order) => order.status === 'open').length;
}

export function newCustomersThisMonth(
  activityEntries: ActivityEntry[] = activity,
  month: string = REFERENCE_MONTH,
): number {
  return activityEntries.filter(
    (entry) => entry.kind === 'customer' && monthKey(entry.date) === month,
  ).length;
}

export function averageOrderValue(orderList: Order[] = orders): number {
  if (orderList.length === 0) {
    return 0;
  }
  const total = orderList.reduce((sum, order) => sum + order.total, 0);
  return round2(total / orderList.length);
}
