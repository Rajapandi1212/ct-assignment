'use client';

import { SortOption } from '@shared/product';
import { useFilters } from '@/hooks/useFilters';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevant', label: 'Relevant' },
  { value: 'a-z', label: 'Name: A-Z' },
  { value: 'z-a', label: 'Name: Z-A' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'new-arrival', label: 'New Arrivals' },
];

export default function SortSection() {
  const { updateSort, searchParams } = useFilters();
  const currentSort = (searchParams.get('sort') as SortOption) || 'relevant';

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-neutral-600 font-medium">Sort by:</span>
      <select
        value={currentSort}
        onChange={(e) => updateSort(e.target.value as SortOption)}
        className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
