import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // 4. Added this to update the browser's HTML tag attribute
    document.documentElement.setAttribute("lang", lng);
  };

  const languages = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
  ];

  return (
    <div className="flex justify-center gap-2">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => changeLanguage(code)}
          className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300
            ${
              // 5. Use startsWith to handle codes like 'en-US' or 'fr-FR'
              i18n.language?.startsWith(code)
                ? "bg-gradient-to-r from-primary-pink to-primary-purple text-white shadow-md"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;