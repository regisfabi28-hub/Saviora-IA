import React from 'react';
import { Compass, GitCompare, Sparkles, Bookmark, Sun, Moon, Sliders } from 'lucide-react';
import emblemImg from '@/src/assets/images/saviora_brand_emblem_1792135830392.jpg';
import { useTheme } from '../context/ThemeContext';

export type AppTab = 'annuaire' | 'comparateur' | 'assistant' | 'favoris' | 'reglages';

interface HeaderProps {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  favoritesCount: number;
  comparatorCount: number;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  favoritesCount,
  comparatorCount,
  onOpenSettings,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 ${
      isDark
        ? 'bg-[#0B1B3A]/95 border-[#12305F]/80 text-[#F8F5EC]'
        : 'bg-[#FFFFFF]/95 border-[#E2D9C8] text-[#0B1B3A] shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Wordmark + luxury emblem */}
        <button
          onClick={() => setCurrentTab('annuaire')}
          className="flex items-center gap-3 text-left group cursor-pointer focus-visible:outline-none"
        >
          <img
            src={emblemImg}
            alt="Saviora IA Emblem"
            className="w-8 h-8 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
          <span className={`text-xl font-bold tracking-tight whitespace-nowrap shrink-0 ${
            isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'
          }`}>
            Saviora <span className="text-[#D4AF37]">IA</span>
          </span>
        </button>

        {/* Zone 2: 5 Main Screen Navigation Links */}
        <nav className={`hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium ${
          isDark ? 'text-[#F8F5EC]/80' : 'text-slate-600'
        }`}>
          <button
            onClick={() => setCurrentTab('annuaire')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'annuaire'
                ? 'text-[#D4AF37] font-semibold border-b-2 border-[#D4AF37]'
                : isDark ? 'hover:text-[#F8F5EC]' : 'hover:text-[#0B1B3A]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Annuaire</span>
          </button>

          <button
            onClick={() => setCurrentTab('comparateur')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'comparateur'
                ? 'text-[#D4AF37] font-semibold border-b-2 border-[#D4AF37]'
                : isDark ? 'hover:text-[#F8F5EC]' : 'hover:text-[#0B1B3A]'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>Comparateur</span>
            {comparatorCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-[#D4AF37] text-[#0B1B3A] font-bold rounded">
                {comparatorCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('assistant')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'assistant'
                ? 'text-[#D4AF37] font-semibold border-b-2 border-[#D4AF37]'
                : isDark ? 'hover:text-[#F8F5EC]' : 'hover:text-[#0B1B3A]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Assistant IA</span>
          </button>

          <button
            onClick={() => setCurrentTab('favoris')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'favoris'
                ? 'text-[#D4AF37] font-semibold border-b-2 border-[#D4AF37]'
                : isDark ? 'hover:text-[#F8F5EC]' : 'hover:text-[#0B1B3A]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Favoris</span>
            {favoritesCount > 0 && (
              <span className={`ml-1 px-1.5 py-0.2 text-[10px] font-mono font-medium rounded ${
                isDark
                  ? 'bg-[#12305F] text-[#F8F5EC] border border-[#D4AF37]/40'
                  : 'bg-amber-100 text-[#0B1B3A] border border-[#D4AF37]/50'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              else setCurrentTab('reglages');
            }}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'reglages'
                ? 'text-[#D4AF37] font-semibold border-b-2 border-[#D4AF37]'
                : isDark ? 'hover:text-[#F8F5EC]' : 'hover:text-[#0B1B3A]'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#D4AF37]" />
            <span>Réglages</span>
          </button>
        </nav>

        {/* Zone 3: Direct Theme switch button & primary action */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition cursor-pointer text-xs font-semibold ${
              isDark
                ? 'border-[#12305F] bg-[#081226] text-[#D4AF37] hover:bg-[#12305F]'
                : 'border-[#E2D9C8] bg-[#F8F5EC] text-amber-800 hover:bg-[#EFECE3] shadow-2xs'
            }`}
            title={isDark ? "Passer en thème clair (Ivoire Pur)" : "Passer en thème sombre (Bleu Nuit)"}
            aria-label="Basculer le thème clair / sombre"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden lg:inline text-[11px]">Clair</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-800" />
                <span className="hidden lg:inline text-[11px]">Sombre</span>
              </>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('assistant')}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-semibold text-[#0B1B3A] bg-[#D4AF37] hover:bg-[#e4be42] active:scale-95 transition rounded-lg whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trouver mon outil</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row for small screens */}
      <div className={`md:hidden flex items-center justify-around border-t px-2 py-2 text-xs ${
        isDark
          ? 'border-[#12305F]/60 bg-[#081226]'
          : 'border-[#E2D9C8] bg-[#F8F5EC]'
      }`}>
        <button
          onClick={() => setCurrentTab('annuaire')}
          className={`px-2 py-1 ${currentTab === 'annuaire' ? 'text-[#D4AF37] font-semibold' : 'text-slate-500'}`}
        >
          Annuaire
        </button>
        <button
          onClick={() => setCurrentTab('comparateur')}
          className={`px-2 py-1 ${currentTab === 'comparateur' ? 'text-[#D4AF37] font-semibold' : 'text-slate-500'}`}
        >
          Comparateur ({comparatorCount})
        </button>
        <button
          onClick={() => setCurrentTab('assistant')}
          className={`px-2 py-1 ${currentTab === 'assistant' ? 'text-[#D4AF37] font-semibold' : 'text-slate-500'}`}
        >
          Assistant
        </button>
        <button
          onClick={() => setCurrentTab('favoris')}
          className={`px-2 py-1 ${currentTab === 'favoris' ? 'text-[#D4AF37] font-semibold' : 'text-slate-500'}`}
        >
          Favoris ({favoritesCount})
        </button>
        <button
          onClick={() => {
            if (onOpenSettings) onOpenSettings();
            else setCurrentTab('reglages');
          }}
          className={`px-2 py-1 ${currentTab === 'reglages' ? 'text-[#D4AF37] font-semibold' : 'text-slate-500'}`}
        >
          Réglages
        </button>
      </div>
    </header>
  );
};
