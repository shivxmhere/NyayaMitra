import { useState } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'hindi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'english', label: 'English', flag: '🌐' },
  { code: 'bhojpuri', label: 'भोजपुरी', flag: '🏠' },
  { code: 'hinglish', label: 'Hinglish', flag: '🔀' },
  { code: 'awadhi', label: 'अवधी', flag: '🏡' },
  { code: 'urdu', label: 'اردو', flag: '☪️' },
];

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(localStorage.getItem('nyaya_lang') || 'hindi');

  const currentLang = languages.find(l => l.code === selected) || languages[0];

  const handleSelect = (code) => {
    setSelected(code);
    localStorage.setItem('nyaya_lang', code);
    setOpen(false);
    window.dispatchEvent(new Event('languageChange'));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-bg-elevated border border-border-default rounded-full px-3 py-1.5 
          text-sm text-text-secondary hover:border-border-hover transition-colors"
      >
        <Globe size={14} />
        <span>{currentLang.flag} {currentLang.label}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-bg-elevated border border-border-default 
            rounded-xl shadow-xl py-2 min-w-[160px]">
            {languages.map((lang) => (
              <button key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-accent-saffron/10 transition-colors
                  flex items-center gap-2 ${selected === lang.code ? 'text-accent-saffron' : 'text-text-secondary'}`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
