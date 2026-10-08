import { describe, expect, it } from 'vitest';
import { formatCurrencyEUR, formatDateDE } from './format';

const NBSP = '\u00A0';

describe('formatCurrencyEUR', () => {
  it('formats whole and decimal amounts in German EUR notation', () => {
    expect(formatCurrencyEUR(1234.56)).toBe(`1.234,56${NBSP}EUR`);
    expect(formatCurrencyEUR(1000000)).toBe(`1.000.000,00${NBSP}EUR`);
    expect(formatCurrencyEUR(0)).toBe(`0,00${NBSP}EUR`);
  });

  it('rounds to two decimals and keeps a leading minus for negatives', () => {
    expect(formatCurrencyEUR(-42.5)).toBe(`-42,50${NBSP}EUR`);
    expect(formatCurrencyEUR(19.999)).toBe(`20,00${NBSP}EUR`);
  });
});

describe('formatDateDE', () => {
  it('formats an ISO date as dd.MM.yyyy', () => {
    expect(formatDateDE('2026-03-14')).toBe('14.03.2026');
    expect(formatDateDE('2023-01-05')).toBe('05.01.2023');
  });

  it('returns the input unchanged when it is not an ISO date', () => {
    expect(formatDateDE('unknown')).toBe('unknown');
  });
});
