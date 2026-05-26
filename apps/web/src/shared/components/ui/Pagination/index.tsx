import React from 'react';
import { Button } from '../Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingsCount?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingsCount = 1,
}) => {
  const pages: (number | string)[] = [];
  const leftSiblingIndex = Math.max(
    currentPage - siblingsCount,
    1,
  );
  const rightSiblingIndex = Math.min(
    currentPage + siblingsCount,
    totalPages,
  );

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  if (totalPages <= 1) return null;

  for (let i = 1; i <= 2; i++) {
    pages.push(i);
  }

  if (shouldShowLeftDots) {
    pages.push('...');
  }

  for (
    let i = leftSiblingIndex;
    i <= rightSiblingIndex;
    i++
  ) {
    pages.push(i);
  }

  if (shouldShowRightDots) {
    pages.push('...');
  }

  for (
    let i = totalPages - 1;
    i <= totalPages;
    i++
  ) {
    if (i > 2) pages.push(i);
  }

  return (
    <div className="flex gap-2 items-center justify-center">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={index}>...</span>
        ) : (
          <Button
            key={index}
            size="sm"
            variant={currentPage === page ? 'primary' : 'ghost'}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};
