import React, { useEffect, useState } from "react";
import { useDistrictStore } from "../stores/districtStore";
import { useLang } from "../LanguageProvider";
import { translations } from "../locales";
import axios from "axios";
import LanguageSwitcher from "./LanguageSwitcher";

axios.get("https://mgnrega-maharashtra.onrender.com/api/districts/");

export default function Dashboard() {
  const { selectedDistrict, setSelectedDistrict } = useDistrictStore();
  const { lang } = useLang();
  const t = translations[lang];
  const [summary, setSummary] = useState(null);
  const [compare, setCompare] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedDistrict) return;

    const fetchData = async () => {
      try {
        const [summaryRes, compareRes] = await Promise.all([
          axios.get(`${API_URL}/districts/${selectedDistrict.id}/summary/`),
          axios.get(
            `${API_URL}/metrics/compare/?district_id=${selectedDistrict.id}&metric=persondays`
          ),
        ]);
        setSummary(summaryRes.data);
        setCompare(compareRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDistrict]);

  if (!selectedDistrict) return null;
  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const latest = summary?.latest || {};
  const delta = summary?.delta || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <LanguageSwitcher />

      {/* Header with back button */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => setSelectedDistrict(null)}
          className="px-4 py-2 bg-white rounded-lg shadow text-white text-gray-900 hover:shadow-md"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mt-4">
          {selectedDistrict.name}
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Persondays */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-semibold">
            Person-Days Worked
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {(latest.persondays || 0).toLocaleString()}
          </p>
          {delta.persondays_change !== undefined && (
            <p
              className={`text-sm mt-2 ${
                delta.persondays_change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {delta.persondays_change >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(delta.persondays_pct_change || 0).toFixed(1)}%
            </p>
          )}
        </div>

        {/* Households */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-semibold">
            Households Worked
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {(latest.households_worked || 0).toLocaleString()}
          </p>
        </div>

        {/* Wages */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm font-semibold">
            Wages Disbursed (₹)
          </p>
          <p className="text-3xl font-bold text-gray-900">
            ₹{((latest.wages_disbursed || 0) / 100000).toFixed(1)}L
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
          <p className="text-gray-600 text-sm font-semibold">
            Pending Payments (₹)
          </p>
          <p className="text-3xl font-bold text-gray-900">
            ₹{((latest.pending_payments || 0) / 100000).toFixed(1)}L
          </p>
        </div>
      </div>

      {/* Comparison with State */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Comparison with Maharashtra Average
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Your District</p>
            <p className="text-2xl font-bold text-blue-600">
              {(compare?.district_value || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">State Average</p>
            <p className="text-2xl font-bold text-gray-600">
              {(compare?.state_average || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
