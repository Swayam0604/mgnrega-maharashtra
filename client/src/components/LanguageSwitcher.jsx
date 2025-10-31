import { useLang } from "../LanguageProvider";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
    return (
        <div className="flex gap-2 justify-end p-2">
      <button onClick={() => setLang("en")} className={lang === "en" ? "bg-blue-200 px-2 py-1 rounded" : "px-2 py-1 rounded"}>English</button>
      <button onClick={() => setLang("hi")} className={lang === "hi" ? "bg-blue-200 px-2 py-1 rounded" : "px-2 py-1 rounded"}>हिंदी</button>
      <button onClick={() => setLang("mr")} className={lang === "mr" ? "bg-blue-200 px-2 py-1 rounded" : "px-2 py-1 rounded"}>मराठी</button>
    </div>
    );
}