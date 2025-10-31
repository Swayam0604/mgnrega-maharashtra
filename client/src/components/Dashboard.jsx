import React, { useEffect, useState } from "react";
import { useDistrictStore } from "../stores/districtStore";
import { useLang } from "../LanguageProvider";
import { translations } from "../locales";
import axios from "axios";
import LanguageSwitcher from "./LanguageSwitcher";

const API_URL = "https://mgnrega-maharashtra.onrender.com/api";

export default function Dashboard() {
  const { selectedDistrict, setSelectedDistrict } = useDistrictStore();
  const { lang } = useLang();
  const t = translations[lang];
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedDistrict) return;

    const fetchMetrics = async () => {
      try {
        // Use the existing /metrics/ endpoint with district_id filter
        const response = await axios.get(
          `${API_URL}/metrics/?district_id=${selectedDistrict.id}`
        );
        console.log("Metrics response:", response.data);

        const data = response.data.results || response.data;
        setMetrics(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
        setError("Failed to load metrics data");
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [selectedDistrict]);


  if (!selectedDistrict) return null;

  const latestMetric = metrics && metrics.length > 0 ? metrics[0] : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <LanguageSwitcher />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={() => setSelectedDistrict(null)}
          className="px-4 py-2 bg-white rounded-lg shadow text-gray-900 hover:shadow-md mb-4"
        >
          ← Back to Districts
        </button>
        <h1 className="text-4xl font-bold text-gray-900">
          {selectedDistrict.name} - Performance Dashboard
        </h1>
        <p className="text-gray-600 mt-2">MGNREGA Metrics & Analysis</p>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-gray-600 text-lg">Loading metrics...</p>
        </div>
      ) : error ? (
        <div className="max-w-7xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <p className="text-red-600 text-sm mt-2">
            Check console for details (F12 → Console)
          </p>
        </div>
      ) : metrics.length === 0 ? (
        <div className="max-w-7xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            No metrics data available for this district
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Person-Days */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm font-semibold">
                Person-Days Worked
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {(latestMetric.persondays || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-2">Latest month</p>
            </div>

            {/* Households */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
              <p className="text-gray-600 text-sm font-semibold">
                Households Worked
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {(latestMetric.households_worked || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-2">Latest month</p>
            </div>

            {/* Wages */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
              <p className="text-gray-600 text-sm font-semibold">
                Wages Disbursed
              </p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                ₹{((latestMetric.wages_disbursed || 0) / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-500 mt-2">Latest month</p>
            </div>

            {/* Pending */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
              <p className="text-gray-600 text-sm font-semibold">
                Pending Payments
              </p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                ₹{((latestMetric.pending_payments || 0) / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-500 mt-2">Latest month</p>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Monthly Data (Last 12 Months)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Month/Year
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">
                      Person-Days
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">
                      Households
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">
                      Wages (₹)
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">
                      Pending (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.slice(0, 12).map((metric, idx) => (
                    <tr
                      key={idx}
                      className={`border-b ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {metric.year}-{String(metric.month).padStart(2, "0")}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {(metric.persondays || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {(metric.households_worked || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ₹{((metric.wages_disbursed || 0) / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ₹{((metric.pending_payments || 0) / 1000000).toFixed(2)}
                        M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-600 text-sm font-semibold">
                Total Records
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {metrics.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                months of data available
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-600 text-sm font-semibold">
                Avg Person-Days/Month
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {metrics.length > 0
                  ? Math.round(
                      metrics.reduce((sum, m) => sum + (m.persondays || 0), 0) /
                        metrics.length
                    ).toLocaleString()
                  : 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-600 text-sm font-semibold">
                Total Wages Disbursed
              </p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ₹
                {(
                  metrics.reduce(
                    (sum, m) => sum + (m.wages_disbursed || 0),
                    0
                  ) / 1000000
                ).toFixed(1)}
                M
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
