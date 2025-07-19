// CSV Export utility functions
export const exportToCSV = (data: any[], filename: string, columnMapping: Record<string, string>) => {
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Create CSV headers using the column mapping
  const headers = Object.values(columnMapping);
  
  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      Object.keys(columnMapping).map(key => {
        const value = getNestedValue(row, key);
        // Handle values that might contain commas, quotes, or newlines
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Helper function to get nested object values
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return current[key];
    }
    return '';
  }, obj);
};

// Format date for CSV export
export const formatDateForCSV = (dateString: string): string => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
};

// Format currency for CSV export
export const formatCurrencyForCSV = (amount: number): string => {
  if (typeof amount !== 'number') return '0';
  return amount.toLocaleString();
};