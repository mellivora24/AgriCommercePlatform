import { useState, useCallback } from 'react';

interface UsePaginationResult {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const usePagination = (
  initialPage = 1,
): UsePaginationResult => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page));
  }, []);

  return {
    currentPage,
    onPageChange,
  };
};
