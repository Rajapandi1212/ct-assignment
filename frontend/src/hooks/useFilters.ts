'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { SortOption } from '@shared/product';
import { useLoading } from '@/contexts/LoadingContext';

export function useFilters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { navigate, isPending } = useLoading();

  const updateURL = useCallback(
    (params: Record<string, string | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === '') {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : '';

      navigate(`${pathname}${query}`);
    },
    [searchParams, navigate, pathname]
  );

  const toggleCheckboxFilter = useCallback(
    (filterKey: string, valueKey: string) => {
      const current = searchParams.get(filterKey)?.split(',') || [];
      const newValues = current.includes(valueKey)
        ? current.filter((v) => v !== valueKey)
        : [...current, valueKey];

      updateURL({ [filterKey]: newValues.length ? newValues.join(',') : null });
    },
    [searchParams, updateURL]
  );

  const updateRangeFilter = useCallback(
    (filterKey: string, min: number, max: number) => {
      updateURL({ [filterKey]: `${min}-${max}` });
    },
    [updateURL]
  );

  const toggleBooleanFilter = useCallback(
    (filterKey: string) => {
      const current = searchParams.get(filterKey);
      updateURL({ [filterKey]: current === 'true' ? null : 'true' });
    },
    [searchParams, updateURL]
  );

  const updateSort = useCallback(
    (sort: SortOption) => {
      updateURL({ sort: sort === 'relevant' ? null : sort });
    },
    [updateURL]
  );

  const updatePage = useCallback(
    (page: number) => {
      updateURL({ page: page === 1 ? null : page.toString() });
    },
    [updateURL]
  );

  const clearAllFilters = useCallback(() => {
    navigate(pathname);
  }, [navigate, pathname]);

  return {
    searchParams,
    toggleCheckboxFilter,
    updateRangeFilter,
    toggleBooleanFilter,
    updateSort,
    updatePage,
    clearAllFilters,
    isPending,
  };
}
