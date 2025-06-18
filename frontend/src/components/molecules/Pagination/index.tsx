import React from 'react';
import { ChevronLeft, ChevronRight, MoreHoriz as MoreHorizontal } from '@mui/icons-material';
import Button from '../../atoms/Button';
import './Pagination.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = '',
  size = 'md'
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is within max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start and end of visible page range
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      // Adjust start if we're near the end
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('ellipsis');
        }
      }
      
      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis and last page if needed
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('ellipsis');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className={`pagination pagination--${size} ${className}`} aria-label="Paginação">
      <div className="pagination__container">
        {/* First page button */}
        {showFirstLast && currentPage > 1 && (
          <Button
            variant="outlined"
            size={size}
            onClick={() => handlePageClick(1)}
            className="pagination__button pagination__button--first"
            aria-label="Primeira página"
          >
            Primeira
          </Button>
        )}

        {/* Previous page button */}
        {showPrevNext && (
          <Button
            variant="outlined"
            size={size}
            disabled={currentPage === 1}
            onClick={() => handlePageClick(currentPage - 1)}
            className="pagination__button pagination__button--prev"
            aria-label="Página anterior"
          >
            <ChevronLeft />
            <span className="pagination__button-text">Anterior</span>
          </Button>
        )}

        {/* Page numbers */}
        <div className="pagination__pages">
          {visiblePages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                  <MoreHorizontal />
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={page === currentPage ? 'primary' : 'outlined'}
                size={size}
                onClick={() => handlePageClick(page)}
                className={`pagination__button pagination__button--page ${
                  page === currentPage ? 'pagination__button--current' : ''
                }`}
                aria-label={`Página ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next page button */}
        {showPrevNext && (
          <Button
            variant="outlined"
            size={size}
            disabled={currentPage === totalPages}
            onClick={() => handlePageClick(currentPage + 1)}
            className="pagination__button pagination__button--next"
            aria-label="Próxima página"
          >
            <span className="pagination__button-text">Próxima</span>
            <ChevronRight />
          </Button>
        )}

        {/* Last page button */}
        {showFirstLast && currentPage < totalPages && (
          <Button
            variant="outlined"
            size={size}
            onClick={() => handlePageClick(totalPages)}
            className="pagination__button pagination__button--last"
            aria-label="Última página"
          >
            Última
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Pagination;
