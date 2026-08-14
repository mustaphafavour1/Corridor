"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { DayPicker, type DateRange } from "react-day-picker";
import { Calendar } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

const PRESETS = ["This Month", "Last Month", "Last 3 Months", "This Year"] as const;

export function DateRangeFilter({
  className,
}: {
  className?: string;
}) {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date("2026-08-01"),
    to: new Date("2026-08-14"),
  });
  const [preset, setPreset] = React.useState<string>("This Month");
  const [open, setOpen] = React.useState(false);

  const label =
    range?.from && range?.to
      ? `${formatDate(range.from)} — ${formatDate(range.to)}`
      : "Select dates";

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-control border border-hairline bg-surface-1 px-2.5 text-xs font-medium text-content-2 hover:bg-surface-3",
            className,
          )}
        >
          <Calendar size={12} className="text-content-faint" />
          {label}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={6}
          className="z-50 rounded-card border border-hairline-strong bg-surface-2 p-2 shadow-pop data-[state=open]:animate-fade-in"
        >
          <div className="flex">
            <div className="flex w-28 flex-col gap-0.5 border-r border-hairline pr-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPreset(p)}
                  className={cn(
                    "rounded-control px-2 py-1.5 text-left text-2xs font-medium transition-colors",
                    preset === p
                      ? "bg-accent-soft text-accent-hi"
                      : "text-content-muted hover:bg-surface-3 hover:text-content",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="pl-2">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={1}
                defaultMonth={new Date("2026-08-01")}
              />
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
