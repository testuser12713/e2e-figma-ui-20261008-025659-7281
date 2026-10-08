import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { RevenuePoint } from './dashboardMetrics';
import { formatCurrencyEUR } from '../../lib/format';
import styles from './DashboardScreen.module.css';

interface RevenueChartProps {
  data: RevenuePoint[];
}

const axisNumber = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });

function formatAxisCurrency(value: number): string {
  return `${axisNumber.format(value)} EUR`;
}

function trendWord(first: number, last: number): string {
  if (last > first) {
    return 'steigender';
  }
  if (last < first) {
    return 'fallender';
  }
  return 'gleichbleibender';
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const first = data[0]?.revenue ?? 0;
  const last = data[data.length - 1]?.revenue ?? 0;
  const ariaLabel = `Umsatzentwicklung der letzten ${data.length} Monate von ${formatCurrencyEUR(
    first,
  )} auf ${formatCurrencyEUR(last)}, ${trendWord(first, last)} Trend`;

  return (
    <>
      <div className={styles.chartWrap} role="img" aria-label={ariaLabel}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <defs>
              <linearGradient id="revenueAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.12} />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-fg_subtle)', fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatAxisCurrency}
              tickLine={false}
              axisLine={false}
              width={80}
              tick={{ fill: 'var(--color-fg_subtle)', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => formatCurrencyEUR(Number(value))}
              contentStyle={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.10)',
              }}
              labelStyle={{ color: 'var(--color-fg)', fontWeight: 500 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-accent)"
              strokeWidth={2}
              fill="url(#revenueAreaFill)"
              dot={{ r: 4, fill: 'var(--color-accent)', stroke: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: 'var(--color-accent)', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <table className={styles.visuallyHidden} aria-label="Umsatzwerte pro Monat">
        <caption>Umsatzwerte pro Monat</caption>
        <thead>
          <tr>
            <th scope="col">Monat</th>
            <th scope="col">Umsatz</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.month}>
              <th scope="row">{point.label}</th>
              <td>{formatCurrencyEUR(point.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
