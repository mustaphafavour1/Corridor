"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Column-config-driven table renderer. A column's alignment is defined
 * exactly once, here, and used to render BOTH the header cell and every
 * body cell in that column — so a `<th>` and its `<td>`s can never disagree
 * on alignment the way they can when text-align is hand-applied separately
 * in header markup and row markup.
 */
export interface DataTableColumn<T> {
  key: string;
  label: React.ReactNode;
  /** Sourced once here and applied identically to the header cell and every
   *  body cell in this column. Right-align amounts, counts, and dates
   *  formatted as numbers. Defaults to "left". */
  align?: "left" | "right" | "center";
  /** Non-alignment header styling (e.g. width hints). */
  headerClassName?: string;
  /** Non-alignment cell styling (e.g. `num`/`strong`/`faint` colour+weight,
   *  font-mono). Never put text-align here — use `align` instead. */
  cellClassName?: string | ((row: T) => string | undefined);
  render: (row: T, rowIndex: number) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  className,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => React.Key;
  onRowClick?: (row: T) => void;
  className?: string;
}) {
  return (
    <table className={cn("data-table", className)}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              // Inline style, not a class: the base .data-table thead th rule
              // sets text-align on the compound selector `.data-table thead th`,
              // which — being a class + 2 tags — beats a bare utility class like
              // .text-right on specificity alone, no matter which one loads
              // last. Inline style always wins over any class-based rule, so
              // this is the one thing that can guarantee the header can never
              // silently drift out of sync with its column's cells again.
              style={{ textAlign: col.align ?? "left" }}
              className={col.headerClassName}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={rowKey(row, i)}
            className={onRowClick ? "cursor-pointer" : undefined}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {columns.map((col) => (
              <td
                key={col.key}
                style={{ textAlign: col.align ?? "left" }}
                className={typeof col.cellClassName === "function" ? col.cellClassName(row) : col.cellClassName}
              >
                {col.render(row, i)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
