import React, { useState } from 'react';
import { X, Star, CheckCircle, ExternalLink, Bookmark, GitCompare, Check, AlertCircle, ArrowUpRight, Share2, Copy } from 'lucide-react';
import { Tool } from '../types/tool';
import { useTheme } from '../context/ThemeContext';

interface ToolDetailModalProps {
  tool: Tool | null;
  onClose: () => void;
  isFavorite: boolean;
  isInComparator: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleComparator: (tool: Tool) => void;
  onSelectAlternative: (toolName: string) => void;
  onOpenMethodology: () => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  tool,
  onClose,
  isFavorite,
  isInComparator,
  onToggleFavorite,
  onToggleComparator,
  onSelectAlternative,
  onOpenMethodology,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copiedLink, setCopiedLink] = useState(false);

  if (!tool) return null;

  // Build clean sharing URLs
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://saviora-ia.fr';
  const toolShareUrl = `${originUrl}?outil=${tool.id}`;

  const xShareText = `Je vous recommande ${tool.nom} (${tool.categorie}) répertorié sur Saviora IA : ${tool.description_courte} · Note : ${tool.note_globale.toFixed(1)}/5 #SavioraIA #IA #Tech`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xShareText)}&url=${encodeURIComponent(toolShareUrl)}`;

  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(toolShareUrl)}`;

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(toolShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className={`relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 border transition-colors ${
          isDark
            ? 'bg-[#0B1B3A] border-[#12305F]'
            : 'bg-[#FFFFFF] border-[#E2D9C8]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className={`flex items-start justify-between p-6 border-b ${
          isDark ? 'border-[#12305F]' : 'border-[#E2D9C8]'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-[#D4AF37]">{tool.categorie}</span>
              <span aria-hidden="true">·</span>
              <span>{tool.modele_economique}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{tool.prix_indicatif}</span>
            </div>

            <div className="flex items-center gap-3">
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'
              }`}>
                {tool.nom}
              </h2>
              <div className="flex items-center gap-1 text-sm text-[#D4AF37] font-mono tabular-nums font-semibold">
                <Star className="w-4 h-4 fill-[#D4AF37]" />
                <span>{tool.note_globale.toFixed(1)} / 5</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-[#12305F]' : 'text-slate-500 hover:text-black hover:bg-slate-100'
            }`}
            aria-label="Fermer la fiche"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Verification Audit Banner */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border text-xs ${
            isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#F8F5EC]/70 border-[#E2D9C8]'
          }`}>
            <div className="flex items-center gap-2.5">
              {tool.verifie ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <span className={`font-semibold block ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>
                      Fiche certifiée par l'équipe Saviora IA
                    </span>
                    <span className="text-slate-500">Dernier contrôle de conformité effectué le {tool.derniere_verification}</span>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className={`font-semibold block ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>
                      Fiche préliminaire en cours d'audit
                    </span>
                    <span className="text-slate-500">Vérification manuelle des fonctionnalités et des tarifs en attente</span>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={onOpenMethodology}
              className="text-[#D4AF37] hover:underline whitespace-nowrap self-start sm:self-center font-medium cursor-pointer"
            >
              Consulter la grille d'évaluation →
            </button>
          </div>

          {/* Detailed Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Présentation générale</h4>
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-[#F8F5EC]/90' : 'text-slate-700'}`}>
              {tool.description_detaillee}
            </p>
          </div>

          {/* Use Cases */}
          {tool.cas_usage && tool.cas_usage.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">Cas d'usage recommandés</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                {tool.cas_usage.map((usage, idx) => (
                  <li key={idx} className={`flex items-start gap-2 p-2.5 rounded-lg border ${
                    isDark ? 'bg-[#081226]/60 border-[#12305F]/50 text-[#F8F5EC]/85' : 'bg-slate-50 border-[#E2D9C8] text-slate-700'
                  }`}>
                    <span className="text-[#D4AF37] font-bold">›</span>
                    <span>{usage}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strengths & Limitations Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50/70 border-emerald-200'
            }`}>
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Check className="w-3.5 h-3.5" />
                <span>Points forts constatés</span>
              </h4>
              <ul className={`space-y-1.5 text-xs ${isDark ? 'text-[#F8F5EC]/90' : 'text-slate-700'}`}>
                {tool.points_forts.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-amber-950/20 border-amber-900/40' : 'bg-amber-50/70 border-amber-200'
            }`}>
              <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Limites & Points d'attention</span>
              </h4>
              <ul className={`space-y-1.5 text-xs ${isDark ? 'text-[#F8F5EC]/90' : 'text-slate-700'}`}>
                {tool.limites.map((lim, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Language support & tags */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t pt-4 ${
            isDark ? 'border-[#12305F] text-slate-400' : 'border-[#E2D9C8] text-slate-600'
          }`}>
            <div>
              <span className="text-slate-500 mr-2">Prise en charge du français :</span>
              <span className={`font-semibold ${tool.support_francais === 'Complet' ? 'text-emerald-500' : isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {tool.support_francais}
              </span>
            </div>

            {tool.tags && tool.tags.length > 0 && (
              <div className="flex items-center gap-2 truncate">
                <span className="text-slate-500">Mots-clés :</span>
                <span className={`font-mono text-[11px] truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {tool.tags.join(' · ')}
                </span>
              </div>
            )}
          </div>

          {/* SOCIAL SHARING SECTION (X, LinkedIn, Direct link) */}
          <div className={`p-4 rounded-xl border space-y-3 transition ${
            isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#F8F5EC]/80 border-[#E2D9C8]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                <Share2 className="w-3.5 h-3.5" />
                <span>Recommander cet outil IA à votre réseau</span>
              </div>
              {copiedLink && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" />
                  <span>Lien copié dans le presse-papier !</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Share on X (Twitter) */}
              <a
                href={xShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer border shadow-2xs ${
                  isDark
                    ? 'bg-black text-white border-slate-800 hover:border-[#D4AF37] hover:bg-neutral-900'
                    : 'bg-black text-white border-neutral-900 hover:bg-neutral-800'
                }`}
                title="Partager une recommandation sur X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Partager sur X</span>
              </a>

              {/* Share on LinkedIn */}
              <a
                href={linkedInShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0A66C2] hover:bg-[#084e96] border border-[#0A66C2] transition cursor-pointer shadow-2xs"
                title="Partager cette fiche sur LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46V10.9M7.86 6.57a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                </svg>
                <span>Partager sur LinkedIn</span>
              </a>

              {/* Copy Direct Link */}
              <button
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  isDark
                    ? 'bg-[#0B1B3A] border-[#12305F] text-slate-300 hover:text-white hover:border-[#D4AF37]'
                    : 'bg-white border-[#E2D9C8] text-slate-700 hover:text-black hover:border-slate-400 shadow-2xs'
                }`}
                title="Copier le lien direct vers cette fiche"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Lien copié' : 'Copier le lien'}</span>
              </button>
            </div>
          </div>

          {/* Direct Alternatives */}
          {tool.alternatives && tool.alternatives.length > 0 && (
            <div className={`border-t pt-4 ${isDark ? 'border-[#12305F]' : 'border-[#E2D9C8]'}`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Alternatives directes répertoriées</h4>
              <div className="flex flex-wrap gap-2">
                {tool.alternatives.map((altName, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectAlternative(altName)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                      isDark
                        ? 'bg-[#081226] border-[#12305F] hover:border-[#D4AF37] text-[#F8F5EC]'
                        : 'bg-[#F8F5EC] border-[#E2D9C8] hover:border-[#D4AF37] text-[#0B1B3A]'
                    }`}
                  >
                    <span>{altName}</span>
                    <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className={`flex flex-wrap items-center justify-between gap-3 p-6 border-t ${
          isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#F8F5EC] border-[#E2D9C8]'
        }`}>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onToggleFavorite(tool.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition cursor-pointer ${
                isFavorite
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                  : isDark
                    ? 'border-[#12305F] text-slate-300 hover:text-white hover:border-slate-500'
                    : 'border-[#E2D9C8] text-slate-600 hover:text-black hover:border-slate-400 bg-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#D4AF37]' : ''}`} />
              <span>{isFavorite ? 'Enregistré dans les favoris' : 'Ajouter aux favoris'}</span>
            </button>

            <button
              onClick={() => onToggleComparator(tool)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition cursor-pointer ${
                isInComparator
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                  : isDark
                    ? 'border-[#12305F] text-slate-300 hover:text-white hover:border-slate-500'
                    : 'border-[#E2D9C8] text-slate-600 hover:text-black hover:border-slate-400 bg-white'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>{isInComparator ? 'Dans le comparateur' : 'Comparer'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={tool.url_officielle}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-[#0B1B3A] bg-[#D4AF37] hover:bg-[#e4be42] rounded-lg transition shadow-md"
            >
              <span>Consulter le site officiel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
