import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { FilterProvider, useFilters } from './FilterContext';

function wrapper({ children }: { children: ReactNode }) {
  return <FilterProvider>{children}</FilterProvider>;
}

describe('FilterContext order search slot', () => {
  it('starts with an empty order search', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });
    expect(result.current.orderSearch).toBe('');
  });

  it('updates the order search through the setter', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });
    act(() => {
      result.current.setOrderSearch('4711');
    });
    expect(result.current.orderSearch).toBe('4711');
  });

  it('keeps the order search independent from the customer search', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });
    act(() => {
      result.current.setOrderSearch('4711');
      result.current.setCustomerSearch('Muster');
    });
    expect(result.current.orderSearch).toBe('4711');
    expect(result.current.customerSearch).toBe('Muster');
  });
});
