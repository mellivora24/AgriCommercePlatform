import { useState, useCallback } from 'react';

interface UsePaginationResult {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  offset: number;
}

export const usePagination = (
  totalItems: number,
  itemsPerPage: number = 10,
): UsePaginationResult => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const onPageChange = useCallback((page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  const offset = (currentPage - 1) * itemsPerPage;

  return {
    currentPage,
    totalPages,
    onPageChange,
    offset,
  };
};
