"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Chart palette — mirrors the --chart-* tokens (SVG attrs need literal colours).
export const CHART = {
  rose: "#c08a7d",
  roseHi: "#e3b7a8",
  green: "#8fa398",
  brand: "#51645a",
  info: "#6fa8cc",
  mint: "#3fbe8f",
  amber: "#e0a85b",
  violet: "#9c8cd4",
  grid: "rgba(143,163,152,0.10)",
  axis: "#6e8579",
};

const AXIS = { fontSize: 9, fill: CHART.axis };
const axisProps = { tick: AXIS, axisLine: false, tickLine: false } as const;

/* ─────────────────────────── Area trend ─────────────────────────── */
export function AreaTrend({
  data,
  dataKey,
  xKey = "date",
  color = CHART.rose,
  height = 200,
  yFormatter,
}: {
  data: Array<Record<string, any>>;
  dataKey: string;
  xKey?: string;
  color?: string;
  height?: number;
  yFormatter?: (v: number) => string;
}) {
  const id = React.useId().replace(/:/g, "");
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 8, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} tickFormatter={yFormatter} width={48} />
        <Tooltip formatter={(v: number) => (yFormatter ? yFormatter(v) : v)} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={1.75}
          fill={`url(#grad-${id})`}
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─────────────────────────── Multi-line ─────────────────────────── */
export function MultiLine({
  data,
  series,
  xKey = "date",
  height = 200,
  yFormatter,
}: {
  data: Array<Record<string, any>>;
  series: { key: string; color: string; label: string }[];
  xKey?: string;
  height?: number;
  yFormatter?: (v: number) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 6, right: 8, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} tickFormatter={yFormatter} width={48} />
        <Tooltip formatter={(v: number) => (yFormatter ? yFormatter(v) : v)} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={1.75}
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ─────────────────────────── Grouped bars ─────────────────────────── */
export function GroupedBars({
  data,
  series,
  xKey = "date",
  height = 200,
  yFormatter,
}: {
  data: Array<Record<string, any>>;
  series: { key: string; color: string; label: string }[];
  xKey?: string;
  height?: number;
  yFormatter?: (v: number) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 6, right: 8, left: 4, bottom: 0 }} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} tickFormatter={yFormatter} width={48} />
        <Tooltip cursor={{ fill: "rgba(143,163,152,0.06)" }} formatter={(v: number) => (yFormatter ? yFormatter(v) : v)} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[2, 2, 0, 0]} maxBarSize={18} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─────────────────────────── Donut ─────────────────────────── */
export function Donut({
  data,
  colors,
  height = 190,
  centerLabel,
  centerValue,
}: {
  data: Array<{ name: string; value: number }>;
  colors: string[];
  height?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `${v}%`} />
        </PieChart>
      </ResponsiveContainer>
      {centerValue && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold text-content tabular">{centerValue}</span>
          {centerLabel && <span className="text-3xs uppercase tracking-wide text-content-faint">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Sparkline ─────────────────────────── */
export function Sparkline({
  data,
  dataKey = "value",
  color = CHART.rose,
  height = 34,
}: {
  data: Array<Record<string, any>>;
  dataKey?: string;
  color?: string;
  height?: number;
}) {
  const id = React.useId().replace(/:/g, "");
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`sp-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} fill={`url(#sp-${id})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─────────────────────────── HTML rank bars (top corridors) ─────────────────────────── */
export function RankBars({
  items,
  valueFormatter,
}: {
  items: { label: string; value: number; color?: string }[];
  valueFormatter?: (v: number) => string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-16 shrink-0 truncate text-2xs text-content-muted font-mono">{it.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full"
              style={{ width: `${(it.value / max) * 100}%`, background: it.color ?? CHART.rose }}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-2xs text-content-2 tabular font-medium">
            {valueFormatter ? valueFormatter(it.value) : it.value}
          </span>
        </div>
      ))}
    </div>
  );
}
