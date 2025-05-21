import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative inline-block">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="appearance-none bg-transparent border-none text-white cursor-pointer pl-7 pr-4 py-2"
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
        <option value="fr">FR</option>
        <option value="de">DE</option>
      </select>
      <Globe className="absolute left-1 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
    </div>
  );
};

export default LanguageToggle;