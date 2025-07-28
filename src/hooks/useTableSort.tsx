import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig<T> {
  key: keyof T | null;
  direction: SortDirection;
}

export function useTableSort<T>(data: T[], initialKey?: keyof T) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({ 
    key: initialKey || null, 
    direction: null 
  });

  const handleSort = (key: keyof T) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        // Cycle through: asc -> desc -> null -> asc
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: null, direction: null };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: keyof T) => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === 'asc') return <ChevronUp className="h-3 w-3" />;
    if (sortConfig.direction === 'desc') return <ChevronDown className="h-3 w-3" />;
    return null;
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        const comparison = aValue.getTime() - bValue.getTime();
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      // Handle date strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          const comparison = dateA.getTime() - dateB.getTime();
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }
      }

      // Fallback to string comparison
      const comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  return {
    sortConfig,
    sortedData,
    handleSort,
    getSortIcon
  };
}

// Sortable table header component
export function SortableHeader<T>({ 
  column, 
  children, 
  onSort, 
  getSortIcon, 
  className = "" 
}: {
  column: keyof T;
  children: React.ReactNode;
  onSort: (key: keyof T) => void;
  getSortIcon: (key: keyof T) => React.ReactNode;
  className?: string;
}) {
  return (
    <th 
      className={`cursor-pointer select-none hover:bg-muted/50 ${className}`}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center justify-between">
        <span>{children}</span>
        <div className="ml-1 flex-shrink-0">
          {getSortIcon(column)}
        </div>
      </div>
    </th>
  );
}