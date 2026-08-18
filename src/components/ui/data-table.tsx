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

const ALIGN_CLASS: Record<NonNullable<DataTableColumn<unknown>["align"]>, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

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
              className={cn(col.align && col.align !== "left" && ALIGN_CLASS[col.align], col.headerClassName)}
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
                className={cn(
                  col.align && col.align !== "left" && ALIGN_CLASS[col.align],
                  typeof col.cellClassName === "function" ? col.cellClassName(row) : col.cellClassName,
                )}
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
