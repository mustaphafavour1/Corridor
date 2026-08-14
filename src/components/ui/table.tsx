"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Horizontal-scroll container so dense tables never break the page layout. */
export function TableScroll({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("w-full overflow-x-auto", className)}>{children}</div>;
}

export function Pagination({
  page,
  totalPages,
  perPage,
  totalItems,
  onPageChange,
  onPerPageChange,
}: {
  page: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  onPageChange: (p: number) => void;
  onPerPageChange: (n: number) => void;
}) {
  const from = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-1 border-t border-hairline-faint">
      <span className="text-sm text-content-muted">
        Showing <span className="text-content-2 tabular">{from}–{to}</span> of{" "}
        <span className="text-content-2 tabular">{totalItems}</span> items
      </span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-center overflow-hidden rounded-control border border-hairline">
          <span className="px-2 py-1 text-2xs font-medium text-content-2 tabular">{perPage}</span>
          <div className="flex flex-col border-l border-hairline">
            <button
              onClick={() => onPerPageChange(Math.min(perPage + 5, 50))}
              className="px-1 py-[1px] text-content-faint hover:bg-surface-3 hover:text-content"
              aria-label="More per page"
            >
              <ChevronUp size={9} />
            </button>
            <button
              onClick={() => onPerPageChange(Math.max(perPage - 5, 5))}
              className="px-1 py-[1px] text-content-faint hover:bg-surface-3 hover:text-content"
              aria-label="Fewer per page"
            >
              <ChevronDown size={9} />
            </button>
          </div>
        </div>
        <span className="text-sm text-content-muted mr-1">per page</span>
        <button
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page <= 1}
          className="flex h-6 w-6 items-center justify-center rounded-control border border-hairline text-content-muted hover:bg-surface-3 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={13} />
        </button>
        <span className="flex h-6 min-w-6 items-center justify-center rounded-control border border-accent/40 bg-accent-soft px-1.5 text-2xs font-semibold text-accent-hi tabular">
          {page}
        </span>
        <span className="text-sm text-content-muted">of {totalPages}</span>
        <button
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page >= totalPages}
          className="flex h-6 w-6 items-center justify-center rounded-control border border-hairline text-content-muted hover:bg-surface-3 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

/** Prominent count above a data table/list — e.g. "82 transfers". Primary
 *  ink, 16-18px semibold, sits just above the header row. */
export function TotalCount({ count, noun }: { count: number; noun: string }) {
  return (
    <p className="text-xl font-semibold text-accent-hi tabular mb-2.5">
      {count.toLocaleString()} <span className="font-medium text-content-muted text-sm">{noun}</span>
    </p>
  );
}

/** Search + pagination state for list pages. Resets to page 1 when the filtered
 *  set shrinks below the current page window. */
export function usePagination<T>(items: T[], initialPerPage = 10) {
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(initialPerPage);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = items.slice((safePage - 1) * perPage, safePage * perPage);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return {
    page: safePage,
    perPage,
    totalPages,
    paginated,
    totalItems: items.length,
    setPage,
    setPerPage: (n: number) => {
      setPerPage(n);
      setPage(1);
    },
    resetPage: () => setPage(1),
  };
}
