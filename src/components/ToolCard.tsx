import React from 'react';
import { Star, CheckCircle, ExternalLink, Bookmark, GitCompare } from 'lucide-react';
import { Tool } from '../types/tool';
import { useTheme } from '../context/ThemeContext';

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  isInComparator: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleComparator: (tool: Tool) => void;
  onSelect: (tool: Tool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isFavorite,
  isInComparator,
  onToggleFavorite,
  onToggleComparator,
  onSelect,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col justify-between rounded-xl p-5 border transition-all duration-200 hover:shadow-lg group ${
      isDark
        ? 'bg-[#0B1B3A] border-[#12305F] hover:border-[#D4AF37]/50'
        : 'bg-[#FFFFFF] border-[#E2D9C8] hover:border-[#D4AF37] shadow-xs'
    }`}>
      <div>
        {/* Top quiet kicker with clean unboxed text metadata (no pill enclosures) */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-semibold text-[#D4AF37]">{tool.categorie}</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{tool.modele_economique}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {tool.verifie ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium" title={`Audit validé le ${tool.derniere_verification}`}>
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Vérifié</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">En cours d'audit</span>
            )}
          </div>
        </div>

        {/* Primary Title and Rating */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3
            onClick={() => onSelect(tool)}
            className={`text-lg font-bold group-hover:text-[#D4AF37] transition-colors cursor-pointer ${
              isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'
            }`}
          >
            {tool.nom}
          </h3>

          <div className="flex items-center gap-1 text-xs text-[#D4AF37] shrink-0 font-mono tabular-nums">
            <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
            <span className="font-semibold">{tool.note_globale.toFixed(1)}</span>
          </div>
        </div>

        {/* Short French Description */}
        <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4 ${
          isDark ? 'text-[#F8F5EC]/75' : 'text-slate-600'
        }`}>
          {tool.description_courte}
        </p>

        {/* Unboxed Metadata row: Price, French support */}
        <div className={`text-xs border-t pt-3 mb-4 space-y-1 ${
          isDark ? 'border-[#12305F]/60 text-slate-400' : 'border-[#E2D9C8] text-slate-600'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Tarif indicatif</span>
            <span className={`font-mono tabular-nums font-medium ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>
              {tool.prix_indicatif}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Support français</span>
            <span className={tool.support_francais === 'Complet' ? 'text-emerald-500 font-medium' : 'text-slate-400'}>
              {tool.support_francais}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer: Single-line controls */}
      <div className={`flex items-center justify-between gap-2 pt-2 border-t ${
        isDark ? 'border-[#12305F]/40' : 'border-[#E2D9C8]/80'
      }`}>
        <button
          onClick={() => onSelect(tool)}
          className="text-xs font-semibold text-[#D4AF37] hover:text-[#b59226] dark:hover:text-[#e4be42] transition cursor-pointer py-1"
        >
          Fiche détaillée →
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleComparator(tool)}
            title={isInComparator ? "Retirer du comparateur" : "Ajouter au comparateur"}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isInComparator
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                : isDark
                  ? 'border-[#12305F] text-slate-400 hover:text-[#F8F5EC] hover:border-slate-500'
                  : 'border-[#E2D9C8] text-slate-500 hover:text-[#0B1B3A] hover:border-slate-400'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onToggleFavorite(tool.id)}
            title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isFavorite
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                : isDark
                  ? 'border-[#12305F] text-slate-400 hover:text-[#F8F5EC] hover:border-slate-500'
                  : 'border-[#E2D9C8] text-slate-500 hover:text-[#0B1B3A] hover:border-slate-400'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#D4AF37]' : ''}`} />
          </button>

          <a
            href={tool.url_officielle}
            target="_blank"
            rel="noopener noreferrer"
            title="Consulter le site officiel"
            className={`p-1.5 rounded-lg border transition ${
              isDark
                ? 'border-[#12305F] text-slate-400 hover:text-[#F8F5EC] hover:border-slate-500'
                : 'border-[#E2D9C8] text-slate-500 hover:text-[#0B1B3A] hover:border-slate-400'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
