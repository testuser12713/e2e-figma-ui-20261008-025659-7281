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

export type DeltaDirection = 'up' | 'down' | 'flat';

export interface KpiDelta {
  direction: DeltaDirection;
  percent: number;
  text: string;
  note?: string;
}

export function formatPercentDE(percent: number): string {
  const rounded = Math.round(percent * 10) / 10;
  const sign = rounded < 0 ? '-' : '+';
  const absolute = Math.abs(rounded).toFixed(1).replace('.', ',');
  return `${sign}${absolute}\u00A0%`;
}

function buildDelta(current: number, previous: number): KpiDelta {
  if (previous === 0) {
    return { direction: 'flat', percent: 0, text: formatPercentDE(0) };
  }
  const percent = round2(((current - previous) / Math.abs(previous)) * 100);
  const direction: DeltaDirection = percent > 0 ? 'up' : percent < 0 ? 'down' : 'flat';
  return { direction, percent, text: formatPercentDE(percent) };
}

/*
 * Compares a month against the previous month. The mock data is sparse, so the
 * month directly before the reference month is sometimes empty; in that case we
 * walk back to the most recent month that holds a value for the metric. Clamping
 * to at most twelve months keeps this a "previous month" comparison and never an
 * unbounded search.
 */
function previousMonthValue(
  month: string,
  valueAt: (month: string) => number,
  maxLookback = 12,
): number {
  for (let offset = 1; offset <= maxLookback; offset += 1) {
    const value = valueAt(addMonths(month, -offset));
    if (value > 0) {
      return value;
    }
  }
  return 0;
}

export function revenueDelta(
  orderList: Order[] = orders,
  month: string = REFERENCE_MONTH,
): KpiDelta {
  const current = currentMonthRevenue(orderList, month);
  const previous = previousMonthValue(month, (key) => currentMonthRevenue(orderList, key));
  return buildDelta(current, previous);
}

export function countOpenOrdersInMonth(orderList: Order[], month: string): number {
  return countOpenOrders(orderList.filter((order) => monthKey(order.date) === month));
}

export function openOrdersDelta(
  orderList: Order[] = orders,
  month: string = REFERENCE_MONTH,
): KpiDelta {
  const current = countOpenOrdersInMonth(orderList, month);
  const previous = previousMonthValue(month, (key) => countOpenOrdersInMonth(orderList, key));
  return buildDelta(current, previous);
}

export function newCustomersDelta(
  activityEntries: ActivityEntry[] = activity,
  month: string = REFERENCE_MONTH,
): KpiDelta {
  const current = newCustomersThisMonth(activityEntries, month);
  const previous = previousMonthValue(month, (key) =>
    newCustomersThisMonth(activityEntries, key),
  );
  return buildDelta(current, previous);
}

export function monthlyAverageOrderValue(orderList: Order[], month: string): number {
  return averageOrderValue(orderList.filter((order) => monthKey(order.date) === month));
}

export function averageOrderValueDelta(
  orderList: Order[] = orders,
  month: string = REFERENCE_MONTH,
): KpiDelta {
  const current = monthlyAverageOrderValue(orderList, month);
  const previous = previousMonthValue(month, (key) =>
    monthlyAverageOrderValue(orderList, key),
  );
  return buildDelta(current, previous);
}
