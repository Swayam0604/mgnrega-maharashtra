import React, { useState } from "react";
import { useDistrictStore } from "../stores/districtStore";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLang } from "../LanguageProvider";
import { translations } from "../locales";

export default function DistrictPicker() {
  const { districts, setSelectedDistrict } = useDistrictStore();
  const [search, setSearch] = useState("");
  const { lang } = useLang();
  const t = translations[lang];

  const filtered = districts.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <LanguageSwitcher />
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.pickerHint}</p>
        </div>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none text-gray-900 placeholder-gray-500"
          />
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filtered.map((district) => (
            <button
              key={district.id}
              onClick={() => setSelectedDistrict(district)}
              className="w-full p-4 bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 text-left border-l-4 border-emerald-500 hover:border-emerald-600 text-gray-900"
            >
              <p className="font-semibold text-white text-lg">
                {district.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
