import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useTheme from "../../Hooks/useTheme";
import { chartPalettes, statusColors } from "../../utils/chartTheme";
import { compactBDT } from "../../utils/format";

export const useChartTheme = () => {
  const { theme } = useTheme();
  return { ...chartPalettes[theme], status: statusColors[theme], theme };
};

export const ChartCard = ({ title, subtitle, action, children, className = "" }) => (
  <section className={`surface min-w-0 p-4 sm:p-5 ${className}`}>
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-base font-bold leading-tight">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted sm:text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

export const ChartEmpty = ({ message, height = 220 }) => (
  <div
    className="flex items-center justify-center rounded-xl border border-dashed border-base-content/15 px-4 text-center text-sm text-muted"
    style={{ height }}
  >
    {message}
  </div>
);

const TooltipBox = ({ active, payload, label, valueFormatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-base-content/10 bg-base-100 px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-semibold">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.dataKey || entry.name} className="flex items-center gap-2 text-muted">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color || entry.payload?.fill }}
          />
          <span>{entry.name}:</span>
          <span className="font-semibold text-base-content">
            {valueFormatter ? valueFormatter(entry.value) : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
};

/** Smooth area chart used for revenue / spending / activity trends. */
export const AreaTrend = ({
  data,
  xKey,
  yKey,
  name,
  height = 260,
  currency = false,
  color,
}) => {
  const palette = useChartTheme();
  const gradientId = useId().replace(/:/g, "");
  const stroke = color || palette.primary;
  const fmt = currency ? compactBDT : (v) => v;

  return (
    <div style={{ height }} className="min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={palette.grid} vertical={false} />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tick={{ fill: palette.axis, fontSize: 11 }}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={currency ? 52 : 34}
            allowDecimals={false}
            tick={{ fill: palette.axis, fontSize: 11 }}
            tickFormatter={fmt}
          />
          <Tooltip
            cursor={{ stroke: palette.grid }}
            content={<TooltipBox valueFormatter={currency ? compactBDT : undefined} />}
          />
          <Area
            type="monotone"
            dataKey={yKey}
            name={name || yKey}
            stroke={stroke}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={{ r: 3, fill: stroke, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Donut chart with an HTML legend underneath (legible down to 320px). */
export const DonutChart = ({ data, centerLabel = "Total", height = 190 }) => {
  const palette = useChartTheme();
  const visible = data.filter((d) => d.value > 0);
  const total = visible.reduce((sum, d) => sum + d.value, 0);
  const colorFor = (name, index) =>
    palette.status[name] || palette.series[index % palette.series.length];

  return (
    <div>
      <div className="relative mx-auto w-full max-w-[260px]" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={visible}
              dataKey="value"
              nameKey="name"
              innerRadius="64%"
              outerRadius="92%"
              paddingAngle={visible.length > 1 ? 3 : 0}
              stroke="none"
            >
              {visible.map((entry, i) => (
                <Cell key={entry.name} fill={colorFor(entry.name, i)} />
              ))}
            </Pie>
            <Tooltip content={<TooltipBox />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold tabular-nums">{total}</span>
          <span className="text-xs text-muted">{centerLabel}</span>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex min-w-0 items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: colorFor(d.name, i) }}
            />
            <span className="truncate text-muted">{d.name}</span>
            <span className="ml-auto font-semibold tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Ranked horizontal bars rendered in HTML so long labels wrap instead of overflowing. */
export const BarList = ({ items, valueFormatter = (v) => v, emptyMessage = "No data yet." }) => {
  const max = Math.max(...items.map((i) => i.value), 1);
  if (!items.length) return <ChartEmpty message={emptyMessage} height={160} />;

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate font-medium" title={item.label}>
              {item.label}
            </span>
            <span className="shrink-0 font-semibold tabular-nums">
              {valueFormatter(item.value)}
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-base-content/8"
            role="presentation"
          >
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.max((item.value / max) * 100, 3)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
