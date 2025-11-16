'use client';

import { useState } from 'react';
import { Filter, CheckboxFilter, BooleanFilter } from '@shared/product';
import { useFilters } from '@/hooks/useFilters';

interface FilterSectionProps {
  filters: Filter[];
}

export default function FilterSection({ filters }: FilterSectionProps) {
  const {
    toggleCheckboxFilter,
    toggleBooleanFilter,
    clearAllFilters,
    searchParams,
    isPending,
  } = useFilters();
  const [expandedFilters, setExpandedFilters] = useState<
    Record<string, boolean>
  >({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const toggleExpand = (key: string) => {
    setExpandedFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    filters.forEach((filter) => {
      if (filter.type === 'checkbox') {
        const selected = searchParams.get(filter.key)?.split(',') || [];
        count += selected.length;
      } else if (
        filter.type === 'boolean' &&
        searchParams.get(filter.key) === 'true'
      ) {
        count += 1;
      }
    });
    return count;
  };

  const FilterContent = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-semibold text-neutral-900">
          FILTERS
        </h2>
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearAllFilters}
            disabled={isPending}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.key} className="border-b border-neutral-200 pb-4">
            <button
              onClick={() => toggleExpand(filter.key)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-neutral-900">
                {filter.label}
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${expandedFilters[filter.key] ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedFilters[filter.key] && (
              <div className="mt-3">
                {filter.type === 'checkbox' && (
                  <CheckboxFilterContent
                    filter={filter}
                    onToggle={toggleCheckboxFilter}
                    searchParams={searchParams}
                  />
                )}
                {filter.type === 'boolean' && (
                  <BooleanFilterContent
                    filter={filter}
                    onToggle={toggleBooleanFilter}
                    searchParams={searchParams}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Loading Overlay */}
      {isPending && (
        <>
          {/* Top progress bar */}
          <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-neutral-200">
            <div className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 animate-progress" />
          </div>

          {/* Full page overlay with spinner */}
          <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[9998] flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-neutral-200 rounded-full" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-neutral-900">
                  Loading products...
                </p>
                <p className="text-sm text-neutral-500 mt-1">Please wait</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsMobileFilterOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="font-medium">Filters</span>
        {getActiveFiltersCount() > 0 && (
          <span className="bg-white text-primary-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {getActiveFiltersCount()}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-display font-semibold text-neutral-900">
                FILTERS
              </h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-neutral-600 hover:text-neutral-900"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-20">
          <FilterContent />
        </div>
      </div>
    </>
  );
}

function CheckboxFilterContent({
  filter,
  onToggle,
  searchParams,
}: {
  filter: CheckboxFilter;
  onToggle: (filterKey: string, valueKey: string) => void;
  searchParams: URLSearchParams;
}) {
  const [pendingToggles, setPendingToggles] = useState<Set<string>>(new Set());
  const selectedValues = searchParams.get(filter.key)?.split(',') || [];

  const handleToggle = (valueKey: string) => {
    // Add to pending state for optimistic UI
    setPendingToggles((prev) => {
      const next = new Set(prev);
      next.add(valueKey);
      return next;
    });

    // Trigger the actual toggle
    onToggle(filter.key, valueKey);

    // Remove from pending after a delay (navigation should happen before this)
    setTimeout(() => {
      setPendingToggles((prev) => {
        const next = new Set(prev);
        next.delete(valueKey);
        return next;
      });
    }, 1000);
  };

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {filter.values.map((value) => {
        const isSelected = selectedValues.includes(value.key);
        const isPending = pendingToggles.has(value.key);
        const isDisabled = value.count === 0;

        return (
          <label
            key={value.key}
            className={`flex items-center justify-between cursor-pointer group ${
              isDisabled ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => !isDisabled && handleToggle(value.key)}
                  disabled={isDisabled}
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 disabled:cursor-not-allowed"
                />
                {isPending && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <span
                className={`text-sm ${
                  isDisabled
                    ? 'text-neutral-400'
                    : 'text-neutral-700 group-hover:text-neutral-900'
                }`}
              >
                {value.label}
              </span>
            </div>
            <span className="text-xs text-neutral-500">
              ({value.count || 0})
            </span>
          </label>
        );
      })}
    </div>
  );
}

function BooleanFilterContent({
  filter,
  onToggle,
  searchParams,
}: {
  filter: BooleanFilter;
  onToggle: (filterKey: string) => void;
  searchParams: URLSearchParams;
}) {
  const isSelected = searchParams.get(filter.key) === 'true';

  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggle(filter.key)}
        className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
      />
      <span className="text-sm text-neutral-700">Show only</span>
    </label>
  );
}
