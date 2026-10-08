const eurFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  currencyDisplay: 'code',
});

export function formatCurrencyEUR(value: number): string {
  return eurFormatter.format(value);
}

export function formatDateDE(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) {
    return iso;
  }
  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
}
