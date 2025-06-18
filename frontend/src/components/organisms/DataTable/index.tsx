import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, MoreHoriz as MoreHorizontal } from '@mui/icons-material';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import Loading from '../../atoms/Loading';
import './DataTable.css';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (item: T, index: number) => void;
  actions?: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  pagination = true,
  pageSize = 10,
  onRowClick,
  actions,
  emptyMessage = 'Nenhum item encontrado',
  className = ''
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter((item) =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    
    const columnKey = String(column.key);
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (item: T, index: number) => {
    if (onRowClick) {
      onRowClick(item, index);
    }
  };

  const renderCellValue = (column: Column<T>, item: T, index: number) => {
    const value = item[column.key as keyof T];
    
    if (column.render) {
      return column.render(value, item, index);
    }
    
    return String(value || '');
  };

  if (loading) {
    return (
      <div className="data-table__loading">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className={`data-table ${className}`}>
      {searchable && (
        <div className="data-table__header">
          <div className="data-table__search">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search />}
            />
          </div>
        </div>
      )}

      <div className="data-table__container">
        <table className="data-table__table">
          <thead className="data-table__thead">
            <tr className="data-table__header-row">
              {columns.map((column, index) => (
                <th
                  key={String(column.key) + index}
                  className={`data-table__th data-table__th--${column.align || 'left'} ${
                    column.sortable ? 'data-table__th--sortable' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="data-table__th-content">
                    {column.title}
                    {column.sortable && sortColumn === String(column.key) && (
                      <span className={`data-table__sort-icon data-table__sort-icon--${sortDirection}`}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="data-table__th data-table__th--actions">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="data-table__tbody">
            {paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (actions ? 1 : 0)} 
                  className="data-table__empty"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className={`data-table__row ${onRowClick ? 'data-table__row--clickable' : ''}`}
                  onClick={() => handleRowClick(item, index)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={String(column.key) + colIndex}
                      className={`data-table__td data-table__td--${column.align || 'left'}`}
                    >
                      {renderCellValue(column, item, index)}
                    </td>
                  ))}
                  {actions && (
                    <td className="data-table__td data-table__td--actions">
                      {actions(item, index)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="data-table__pagination">
          <div className="data-table__pagination-info">
            Mostrando {(currentPage - 1) * pageSize + 1} a{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} de{' '}
            {sortedData.length} registros
          </div>
          <div className="data-table__pagination-controls">
            <Button
              variant="outlined"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            >
              <ChevronLeft />
              Anterior
            </Button>
            <span className="data-table__pagination-current">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outlined"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            >
              Próxima
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
