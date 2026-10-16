import React from 'react';
import { Search, Sparkles, CheckCircle2, SlidersHorizontal, ArrowRight } from 'lucide-react';
import heroImg from '@/src/assets/images/saviora_hero_banner_1792135831170.jpg';
import { useTheme } from '../context/ThemeContext';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (val: boolean) => void;
  onOpenAssistant: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
  verifiedOnly,
  setVerifiedOnly,
  onOpenAssistant,
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-[#0B1B3A] mb-8 shadow-xl transition-colors ${
      isDark ? 'border-[#12305F]' : 'border-[#D4AF37]/40 shadow-md'
    }`}>
      {/* Background Image with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Saviora IA Library"
          className="w-full h-full object-cover opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#081226] via-[#0B1B3A]/90 to-[#081226]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-14 max-w-4xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-3">
          <span>Édition Francophone 2026</span>
          <span aria-hidden="true">·</span>
          <span>Indépendante & Transparente</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F8F5EC] leading-tight text-balance mb-4">
          Le repère d'excellence des outils d'intelligence artificielle
        </h1>

        <p className="text-base sm:text-lg text-[#F8F5EC]/80 leading-relaxed max-w-2xl mb-8">
          Découvrez 200 outils testés, comparez leurs tarifs réels et trouvez l'alternative adaptée à votre pratique professionnelle ou créative.
        </p>

        {/* Search Bar Input */}
        <div className="relative max-w-2xl mb-6">
          <div className="flex items-center bg-[#081226]/90 border border-[#12305F] hover:border-[#D4AF37]/50 focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 rounded-xl px-4 py-3 transition shadow-lg">
            <Search className="w-5 h-5 text-[#D4AF37] shrink-0 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, usage (ex: rédaction SEO, transcription, 3D), ou mot-clé..."
              className="w-full bg-transparent text-[#F8F5EC] placeholder:text-slate-400 focus:outline-none text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 shrink-0 ml-2 cursor-pointer"
              >
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Strip & Secondary Actions */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition cursor-pointer whitespace-nowrap ${
              verifiedOnly
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] font-semibold'
                : 'bg-[#12305F]/60 border-[#12305F] text-[#F8F5EC]/80 hover:border-[#D4AF37]/50'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${verifiedOnly ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
            <span>Fiches vérifiées uniquement (52 disponibles)</span>
          </button>

          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 text-[#F8F5EC]/90 hover:text-[#D4AF37] transition cursor-pointer font-medium whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Besoin d'un conseil personnalisé ? Interrogez l'assistant</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* KPI Row at the bottom */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 sm:px-10 py-4 bg-[#081226]/80 border-t border-[#12305F]/80 text-xs">
        <div>
          <span className="text-xl font-bold font-mono text-[#D4AF37] block">200</span>
          <span className="text-slate-400">Outils répertoriés</span>
        </div>
        <div>
          <span className="text-xl font-bold font-mono text-[#F8F5EC] block">52</span>
          <span className="text-slate-400">Fiches vérifiées manuellement</span>
        </div>
        <div>
          <span className="text-xl font-bold font-mono text-[#F8F5EC] block">12</span>
          <span className="text-slate-400">Catégories spécialisées</span>
        </div>
        <div>
          <span className="text-xl font-bold font-mono text-[#D4AF37] block">100%</span>
          <span className="text-slate-400">Sans affiliation publicitaire</span>
        </div>
      </div>
    </div>
  );
};
