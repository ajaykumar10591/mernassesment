import React, { useState } from 'react';
import { TableProps } from '../types';

export const DynamicTable: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  pagination,
  onSort,
  onSearch,
  onPageChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; order: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    if (!onSort) return;
    
    const order = sortConfig?.key === key && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, order });
    onSort(key, order);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return '↕️';
    return sortConfig.order === 'asc' ? '↑' : '↓';
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Search */}
      {onSearch && (
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              width: '300px',
            }}
          />
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px',
                    borderBottom: '1px solid #e5e7eb',
                    cursor: column.sortable && onSort ? 'pointer' : 'default',
                  }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {column.label}
                    {column.sortable && onSort && (
                      <span style={{ fontSize: '12px' }}>{getSortIcon(column.key)}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id || index}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                  }}
                >
                  {columns.map(column => (
                    <td
                      key={column.key}
                      style={{
                        padding: '12px',
                        fontSize: '14px',
                        verticalAlign: 'top',
                      }}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key] || '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && onPageChange && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
            fontSize: '14px',
          }}
        >
          <div style={{ color: '#6b7280' }}>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                opacity: pagination.page <= 1 ? 0.5 : 1,
              }}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: page === pagination.page ? '#3b82f6' : 'white',
                    color: page === pagination.page ? 'white' : 'black',
                    cursor: 'pointer',
                  }}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: pagination.page >= pagination.pages ? 'not-allowed' : 'pointer',
                opacity: pagination.page >= pagination.pages ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};