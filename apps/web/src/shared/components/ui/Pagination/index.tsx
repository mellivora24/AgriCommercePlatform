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
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];

  const addPage = (page: number | string) => {
    if (!pages.includes(page)) {
      pages.push(page);
    }
  };

  const leftSiblingIndex = Math.max(
    currentPage - siblingsCount,
    1,
  );

  const rightSiblingIndex = Math.min(
    currentPage + siblingsCount,
    totalPages,
  );

  const shouldShowLeftDots = leftSiblingIndex > 3;
  const shouldShowRightDots =
    rightSiblingIndex < totalPages - 2;

  // First pages
  for (
    let i = 1;
    i <= Math.min(2, totalPages);
    i++
  ) {
    addPage(i);
  }

  // Left dots
  if (shouldShowLeftDots) {
    addPage('left-dots');
  }

  // Middle pages
  for (
    let i = leftSiblingIndex;
    i <= rightSiblingIndex;
    i++
  ) {
    addPage(i);
  }

  // Right dots
  if (shouldShowRightDots) {
    addPage('right-dots');
  }

  // Last pages
  for (
    let i = Math.max(totalPages - 1, 1);
    i <= totalPages;
    i++
  ) {
    addPage(i);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {pages.map((page) =>
        typeof page === 'string' ? (
          <span
            key={page}
            className="px-2 text-gray-500"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            size="sm"
            variant={
              currentPage === page
                ? 'primary'
                : 'ghost'
            }
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};
