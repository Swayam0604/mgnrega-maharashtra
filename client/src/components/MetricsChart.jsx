import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function MetricsChart({ metrics }) {
  if (!metrics || metrics.length === 0) return null;

  const data = [...metrics].reverse().map((m) => ({
    month: `${m.year}-${String(m.month).padStart(2, "0")}`,
    PersonDays: m.persondays,
    Wages: Math.round(m.wages_disbursed / 100000), // in lakhs
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="PersonDays" stroke="#1d4ed8" />
        <Line type="monotone" dataKey="Wages" stroke="#eab308" />
      </LineChart>
    </ResponsiveContainer>
  );
}
