import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useLang } from "../LanguageProvider";
import { translations } from "../locales";

export default function WagesChart({ metrics }) {
  const { lang } = useLang();
  const t = translations[lang];

  if (!metrics || metrics.length === 0) return null;

  const data = [...metrics].reverse().map((m) => ({
    month: `${m.year}-${String(m.month).padStart(2, "0")}`,
    Wages: Math.round(m.wages_disbursed / 100000), // in lakhs
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => {
            if (name === "Wages") return [value, t.wages || "Wages (₹)"];
            return [value, name];
          }}
        />
        <Bar dataKey="Wages" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
}
