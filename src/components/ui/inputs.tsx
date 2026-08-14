"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────── SearchInput ─────────────────────────── */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search
        size={13}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-content-faint"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-control border border-hairline bg-surface-1 pl-7 pr-3 text-[11px] text-content placeholder:text-content-dim focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      />
    </div>
  );
}

/* ─────────────────────────── TextInput ─────────────────────────── */
export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-9 w-full rounded-control border border-hairline bg-surface-1 px-3 text-[13px] text-content placeholder:text-content-dim focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
      className,
    )}
    {...props}
  />
));
TextInput.displayName = "TextInput";

/* ─────────────────────────── Select (styled native) ─────────────────────────── */
export function Select({
  value,
  onChange,
  options,
  className,
  size = "sm",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[] | string[];
  className?: string;
  size?: "xs" | "sm";
}) {
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <div className={cn("relative inline-flex", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "appearance-none rounded-control border border-hairline bg-surface-1 pr-6 font-medium text-content-2 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] cursor-pointer",
          size === "xs" ? "h-6 pl-2 text-2xs" : "h-8 pl-2.5 text-[11px]",
        )}
      >
        {opts.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface-2 text-content">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-content-faint"
      />
    </div>
  );
}

/* ─────────────────────────── Switch ─────────────────────────── */
export function Switch({
  checked,
  onCheckedChange,
  className,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "relative h-4 w-7 shrink-0 rounded-full border border-hairline transition-colors data-[state=checked]:bg-accent data-[state=unchecked]:bg-surface-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        className,
      )}
    >
      <SwitchPrimitive.Thumb className="block h-3 w-3 translate-x-0.5 rounded-full bg-white shadow-subtle transition-transform data-[state=checked]:translate-x-[13px]" />
    </SwitchPrimitive.Root>
  );
}

/* ─────────────────────────── Tabs (underline) ─────────────────────────── */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { value: T; label: React.ReactNode; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 border-b border-hairline", className)}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={cn(
              "relative -mb-px flex items-center gap-1.5 px-3 pb-2 pt-1 text-xs font-medium transition-colors",
              active
                ? "text-content border-b-[1.5px] border-accent"
                : "text-content-faint hover:text-content-2 border-b-[1.5px] border-transparent",
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-[1px] text-3xs font-semibold tabular",
                  active ? "bg-accent-soft text-accent-hi" : "bg-surface-3 text-content-faint",
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
