import React, { useState, useEffect } from 'react';
import { BookOpen, Shield, Palette, FileText, Trash2, Mail, ExternalLink, CheckCircle2, Server, Sun, Moon, Sliders, Check, Sparkles, Star, RefreshCw } from 'lucide-react';
import { CONFIG } from '../core/config';
import { useTheme, PALETTES } from '../context/ThemeContext';

interface DocumentationViewProps {
  initialSubTab?: 'reglages' | 'methode' | 'stores' | 'charte' | 'confidentialite' | 'conditions';
  onClearAllData: () => void;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({
  initialSubTab = 'reglages',
  onClearAllData,
}) => {
  const [activeDoc, setActiveDoc] = useState<'reglages' | 'methode' | 'stores' | 'charte' | 'confidentialite' | 'conditions'>(initialSubTab);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  const { theme, isDark, palette, toggleTheme, setTheme } = useTheme();

  // Sync state whenever prop changes
  useEffect(() => {
    if (initialSubTab) {
      setActiveDoc(initialSubTab);
    }
  }, [initialSubTab]);

  const handlePurge = () => {
    if (window.confirm("Attention : cette action réinitialisera tous vos favoris et préférences stockés dans ce navigateur. Confirmer ?")) {
      onClearAllData();
      setPurgeSuccess(true);
      setTimeout(() => setPurgeSuccess(false), 4000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className={`border-b pb-6 transition-colors ${isDark ? 'border-[#12305F]' : 'border-[#E2D9C8]'}`}>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
          <Sliders className="w-3.5 h-3.5" />
          <span>Réglages, Thème & Gouvernance</span>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>
          Préférences & Documentation Saviora IA
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Gérez votre palette de couleurs (Context API), inspectez la méthode d'évaluation et vérifiez la conformité de l'application.
        </p>
      </div>

      {/* Segmented Sub-navigation buttons with 'Réglages & Thème' in first position */}
      <div className={`flex flex-wrap gap-2 p-1.5 rounded-xl text-xs border transition-colors ${
        isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8] shadow-xs'
      }`}>
        <button
          onClick={() => setActiveDoc('reglages')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
            activeDoc === 'reglages'
              ? isDark ? 'bg-[#12305F] text-[#D4AF37] font-semibold shadow-sm ring-1 ring-[#D4AF37]/50' : 'bg-[#F8F5EC] text-amber-800 font-bold shadow-xs ring-1 ring-[#D4AF37]'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Thème & Palette</span>
        </button>

        <button
          onClick={() => setActiveDoc('methode')}
          className={`px-3 py-2 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
            activeDoc === 'methode'
              ? isDark ? 'bg-[#12305F] text-[#D4AF37] font-semibold shadow-sm' : 'bg-[#F8F5EC] text-amber-800 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Méthode d'Évaluation
        </button>

        <button
          onClick={() => setActiveDoc('stores')}
          className={`px-3 py-2 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
            activeDoc === 'stores'
              ? isDark ? 'bg-[#12305F] text-[#D4AF37] font-semibold shadow-sm' : 'bg-[#F8F5EC] text-amber-800 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Conformité Stores
        </button>

        <button
          onClick={() => setActiveDoc('charte')}
          className={`px-3 py-2 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
            activeDoc === 'charte'
              ? isDark ? 'bg-[#12305F] text-[#D4AF37] font-semibold shadow-sm' : 'bg-[#F8F5EC] text-amber-800 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Charte Graphique
        </button>

        <button
          onClick={() => setActiveDoc('confidentialite')}
          className={`px-3 py-2 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
            activeDoc === 'confidentialite'
              ? isDark ? 'bg-[#12305F] text-[#D4AF37] font-semibold shadow-sm' : 'bg-[#F8F5EC] text-amber-800 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Confidentialité
        </button>

        <button
          onClick={() => setActiveDoc('conditions')}
          className={`px-3 py-2 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
            activeDoc === 'conditions'
              ? isDark ? 'bg-[#12305F] text-[#D4AF37] font-semibold shadow-sm' : 'bg-[#F8F5EC] text-amber-800 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Conditions d'Utilisation
        </button>
      </div>

      {/* Content panel */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-[#0B1B3A] border-[#12305F] text-slate-300'
          : 'bg-[#FFFFFF] border-[#E2D9C8] text-[#0B1B3A] shadow-xs'
      } leading-relaxed text-sm`}>
        
        {/* 1. RÉGLAGES DU THÈME & GESTION DE LA PALETTE (CONTEXT API) */}
        {activeDoc === 'reglages' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-700/20">
              <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-base">
                <Palette className="w-5 h-5" />
                <h3>Bascule de Thème & Gestionnaire de Palette</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-[#D4AF37]/15 text-[#D4AF37] font-medium border border-[#D4AF37]/30 self-start sm:self-center">
                React Context API (ThemeContext)
              </span>
            </div>

            {/* THEME SWITCHER CARD */}
            <div className={`p-6 rounded-2xl border transition-all ${
              isDark
                ? 'bg-[#081226] border-[#12305F]'
                : 'bg-[#F8F5EC]/70 border-[#E2D9C8]'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <h4 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>
                    <span>Mode d'Affichage : Sombre ou Clair</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">
                    Sélectionnez votre univers graphique. La palette de couleurs et les tokens CSS sont propagés instantanément à l'ensemble des composants grâce au <strong>Context API</strong> de React, et conservés dans votre navigateur.
                  </p>
                </div>

                {/* Physical Interactive Toggle Switch (Slider style) */}
                <div className="flex items-center gap-3 self-start md:self-center p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-slate-700/20">
                  <span className={`text-xs font-semibold ${!isDark ? 'text-amber-800' : 'text-slate-400'}`}>
                    Clair
                  </span>
                  <button
                    role="switch"
                    aria-checked={isDark}
                    onClick={toggleTheme}
                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                      isDark ? 'bg-[#12305F]' : 'bg-[#D4AF37]'
                    }`}
                    title={isDark ? "Basculer vers le mode clair" : "Basculer vers le mode sombre"}
                  >
                    <span className="sr-only">Basculer le thème clair / sombre</span>
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full shadow-md transition duration-200 ease-in-out flex items-center justify-center ${
                        isDark ? 'translate-x-7 bg-[#0B1B3A] text-[#D4AF37]' : 'translate-x-0 bg-white text-amber-700'
                      }`}
                    >
                      {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                  <span className={`text-xs font-semibold ${isDark ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
                    Sombre
                  </span>
                </div>
              </div>

              {/* Interactive Visual Cards for the Two Themes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Dark Option Card */}
                <div
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                    isDark
                      ? 'border-[#D4AF37] bg-[#0B1B3A] shadow-md ring-2 ring-[#D4AF37]/20'
                      : 'border-slate-300/60 bg-slate-900/10 hover:border-slate-400 opacity-75'
                  }`}
                >
                  {isDark && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                      <Check className="w-3 h-3" /> Actif
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-[#081226] text-[#D4AF37] border border-[#12305F]">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#F8F5EC]">Mode Sombre (Bleu Nuit)</h5>
                      <span className="text-[11px] text-[#D4AF37]">Signature d'origine Saviora IA</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    Surfaces en bleu nuit (#0B1B3A & #081226), bordures en bleu profond (#12305F) et or royal (#D4AF37). Idéal pour un confort visuel prolongé.
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#081226] text-[#F8F5EC] border border-[#12305F]">#081226</span>
                    <span className="px-2 py-0.5 rounded bg-[#0B1B3A] text-[#F8F5EC] border border-[#12305F]">#0B1B3A</span>
                    <span className="px-2 py-0.5 rounded bg-[#D4AF37] text-[#0B1B3A] font-bold">#D4AF37</span>
                  </div>
                </div>

                {/* Light Option Card */}
                <div
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                    !isDark
                      ? 'border-[#D4AF37] bg-white shadow-md ring-2 ring-[#D4AF37]/20'
                      : 'border-slate-700/60 bg-[#081226]/60 hover:border-slate-600 opacity-75'
                  }`}
                >
                  {!isDark && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      <Check className="w-3 h-3" /> Actif
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-[#F8F5EC] text-amber-800 border border-[#E2D9C8]">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#0B1B3A]">Mode Clair (Ivoire Pur)</h5>
                      <span className="text-[11px] text-amber-700">Haute lisibilité diurne</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                    Fond ivoire chaleureux (#F8F5EC), cartes blanches immaculées (#FFFFFF) et typographie bleu nuit (#0B1B3A). Contraste parfait en pleine lumière.
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#F8F5EC] text-[#0B1B3A] border border-[#E2D9C8]">#F8F5EC</span>
                    <span className="px-2 py-0.5 rounded bg-white text-[#0B1B3A] border border-[#E2D9C8]">#FFFFFF</span>
                    <span className="px-2 py-0.5 rounded bg-[#D4AF37] text-[#0B1B3A] font-bold">#D4AF37</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Context Palette Swatches */}
              <div className="border-t border-slate-700/20 pt-4">
                <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider block mb-3">
                  Variables de Couleurs diffusées par ThemeContext : {palette.name}
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  <div className="p-2.5 rounded-lg border text-xs" style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}>
                    <span className="text-[10px] text-slate-400 block">Fond Principal</span>
                    <span className="font-mono text-xs font-semibold" style={{ color: palette.textPrimary }}>{palette.primaryBg}</span>
                  </div>

                  <div className="p-2.5 rounded-lg border text-xs" style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}>
                    <span className="text-[10px] text-slate-400 block">Surfaces Cartes</span>
                    <span className="font-mono text-xs font-semibold" style={{ color: palette.textPrimary }}>{palette.cardBg}</span>
                  </div>

                  <div className="p-2.5 rounded-lg border text-xs" style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}>
                    <span className="text-[10px] text-slate-400 block">Bordures</span>
                    <span className="font-mono text-xs font-semibold" style={{ color: palette.textPrimary }}>{palette.cardBorder}</span>
                  </div>

                  <div className="p-2.5 rounded-lg border text-xs" style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}>
                    <span className="text-[10px] text-slate-400 block">Texte Principal</span>
                    <span className="font-mono text-xs font-semibold" style={{ color: palette.textPrimary }}>{palette.textPrimary}</span>
                  </div>

                  <div className="p-2.5 rounded-lg border text-xs" style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}>
                    <span className="text-[10px] text-slate-400 block">Accent Royal (Or)</span>
                    <span className="font-mono text-xs font-semibold text-[#D4AF37]">{palette.goldAccent}</span>
                  </div>

                  <div className="p-2.5 rounded-lg border text-xs" style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}>
                    <span className="text-[10px] text-slate-400 block">Audit Vérifié</span>
                    <span className="font-mono text-xs font-semibold text-emerald-500">{palette.statusVerified}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE SIMULATION PREVIEW OF TOOL CARD */}
            <div className={`p-5 rounded-2xl border transition ${
              isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8] shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Aperçu en direct du rendu graphique ({palette.name})</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Conforme WCAG AAA</span>
              </div>

              {/* Mock AI Card Preview */}
              <div className={`max-w-md p-4 rounded-xl border transition-all ${
                isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-white border-[#E2D9C8] shadow-xs'
              }`}>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-[#D4AF37]">Texte & Rédaction</span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Vérifié</span>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h5 className={`font-bold text-base ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>Mistral Le Chat</h5>
                  <div className="flex items-center gap-1 text-xs text-[#D4AF37] font-mono font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    <span>4.8 / 5</span>
                  </div>
                </div>
                <p className={`text-xs mb-3 leading-relaxed ${isDark ? 'text-[#F8F5EC]/75' : 'text-slate-600'}`}>
                  L'intelligence artificielle conversationnelle française d'excellence développée par Mistral AI.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/20 text-xs">
                  <span className="text-slate-400 font-mono">Gratuit & API</span>
                  <button className="px-2.5 py-1 text-xs font-semibold text-[#0B1B3A] bg-[#D4AF37] hover:bg-[#e4be42] rounded-md transition cursor-pointer">
                    Consulter
                  </button>
                </div>
              </div>
            </div>

            {/* Config summary table */}
            <div className={`overflow-x-auto rounded-xl border ${
              isDark ? 'border-[#12305F] bg-[#081226]' : 'border-[#E2D9C8] bg-[#FFFFFF]'
            }`}>
              <table className="w-full text-xs text-left">
                <thead className={`border-b ${
                  isDark ? 'bg-[#0B1B3A] text-slate-400 border-[#12305F]' : 'bg-[#F8F5EC] text-slate-600 border-[#E2D9C8]'
                }`}>
                  <tr>
                    <th className="p-3">Paramètre</th>
                    <th className="p-3">Valeur configurée</th>
                    <th className="p-3">Rôle</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isDark ? 'divide-[#12305F]/60 text-slate-300' : 'divide-[#E2D9C8] text-slate-700'
                }`}>
                  <tr>
                    <td className="p-3 font-mono font-medium text-[#D4AF37]">appName</td>
                    <td className="p-3 font-semibold">{CONFIG.appName}</td>
                    <td className="p-3 text-slate-500">Nom officiel de l'application</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-medium text-[#D4AF37]">version</td>
                    <td className="p-3 font-mono">{CONFIG.version} (Squelette V0.1)</td>
                    <td className="p-3 text-slate-500">Version du catalogue (200 outils)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-medium text-[#D4AF37]">supportEmail</td>
                    <td className="p-3 font-semibold">{CONFIG.supportEmail}</td>
                    <td className="p-3 text-slate-500">Contact et signalement stores</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-medium text-[#D4AF37]">assistantUrl</td>
                    <td className="p-3 font-mono text-xs">{CONFIG.assistantUrl}</td>
                    <td className="p-3 text-slate-500">Serveur API Gemini + bascule secours</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-medium text-[#D4AF37]">privacyUrl</td>
                    <td className="p-3 font-mono text-xs">{CONFIG.privacyUrl}</td>
                    <td className="p-3 text-slate-500">URL publique politique de confidentialité</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Data reset section */}
            <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-900/40">
              <h4 className="font-bold text-rose-300 text-sm mb-1 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Zone d'effacement des données locales (Conformité Stores)</span>
              </h4>
              <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Conformément aux exigences de Google Play et de l'Apple App Store, vous pouvez purger l'intégralité de vos favoris et préférences stockés dans votre navigateur en un clic.
              </p>

              <button
                onClick={handlePurge}
                className="px-4 py-2 bg-rose-900/60 hover:bg-rose-800 text-rose-100 border border-rose-700/60 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Purger toutes les données locales
              </button>

              {purgeSuccess && (
                <div className="mt-3 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Toutes vos données locales ont été effacées avec succès.</span>
                </div>
              )}
            </div>

            {/* Contact Box */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
              isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#F8F5EC]/70 border-[#E2D9C8]'
            }`}>
              <div className="flex items-center gap-2 text-slate-500">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>Support et signalement d'erreur de fiche : <strong>{CONFIG.supportEmail}</strong></span>
              </div>
              <a
                href={`mailto:${CONFIG.supportEmail}`}
                className="text-[#D4AF37] hover:underline font-semibold"
              >
                Envoyer un courriel →
              </a>
            </div>
          </div>
        )}

        {/* 2. MÉTHODE D'ÉVALUATION */}
        {activeDoc === 'methode' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-base">
              <CheckCircle2 className="w-5 h-5" />
              <h3>Méthode publique d'évaluation des fiches – Saviora IA</h3>
            </div>

            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              Chaque outil indexé dans l'annuaire Saviora IA fait l'objet d'un examen méthodique et impartial. Notre rédaction n'accepte aucune rémunération pour modifier un classement, améliorer une note ou décerner le statut <code>verifie: true</code>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#F8F5EC]/70 border-[#E2D9C8]'}`}>
                <h4 className={`font-bold mb-1 ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>1. Qualité réelle des résultats (30%)</h4>
                <p className="text-xs text-slate-500">
                  Capacité avérée du modèle ou logiciel à honorer ses promesses. Exactitude de la génération, cohérence sémantique et stabilité.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#F8F5EC]/70 border-[#E2D9C8]'}`}>
                <h4 className={`font-bold mb-1 ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>2. Support du français (20%)</h4>
                <p className="text-xs text-slate-500">
                  Maîtrise de la langue française dans l'interface, les résultats générés et la sensibilité aux spécificités culturelles francophones.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#F8F5EC]/70 border-[#E2D9C8]'}`}>
                <h4 className={`font-bold mb-1 ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>3. Transparence tarifaire (20%)</h4>
                <p className="text-xs text-slate-500">
                  Clarté des modèles freemium, absence de frais dissimulés, prédictibilité des coûts à l'usage et conditions d'annulation simples.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#F8F5EC]/70 border-[#E2D9C8]'}`}>
                <h4 className={`font-bold mb-1 ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>4. Sécurité & RGPD (15%)</h4>
                <p className="text-xs text-slate-500">
                  Respect de la vie privée, politique d'entraînement sur les données utilisateur et localisation de l'infrastructure de calcul.
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#F8F5EC]/70 border-[#E2D9C8]'}`}>
              <h4 className="font-bold text-[#D4AF37] mb-1">Règle de publication : Statut de vérification</h4>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Chaque fiche du catalogue porte une mention <code>verifie: boolean</code> et une date <code>derniere_verification (AAAA-MM-JJ)</code>. Actuellement, 52 fiches de pointe ont été auditées en profondeur et 148 fiches préliminaires sont en cours de cycle de contrôle.
              </p>
            </div>
          </div>
        )}

        {/* 3. CONFORMITÉ STORES */}
        {activeDoc === 'stores' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-base">
              <Shield className="w-5 h-5" />
              <h3>Conformité Google Play & Apple App Store</h3>
            </div>

            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              Pour assurer une publication sereine sur l'App Store et Google Play, Saviora IA respecte scrupuleusement l'ensemble des directives éditoriales et de sécurité des données :
            </p>

            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#F8F5EC]/70 border-[#E2D9C8]'}`}>
                <h4 className={`font-bold mb-2 ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>Exigences Google Play (Data Safety & Policies)</h4>
                <ul className="space-y-1.5 text-xs text-slate-500">
                  <li className="flex items-center gap-2">✓ Données privées : les favoris sont conservés localement sur l'appareil.</li>
                  <li className="flex items-center gap-2">✓ Droit à l'effacement : un bouton de purge intégrale est disponible en 1 clic.</li>
                  <li className="flex items-center gap-2">✓ Transparence des liens : redirection exclusive vers les sites officiels sans tromperie.</li>
                  <li className="flex items-center gap-2">✓ Support et contact : adresse de courriel officielle accessible en permanence.</li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#F8F5EC]/70 border-[#E2D9C8]'}`}>
                <h4 className={`font-bold mb-2 ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>Exigences Apple App Store (Review Guidelines)</h4>
                <ul className="space-y-1.5 text-xs text-slate-500">
                  <li className="flex items-center gap-2">✓ Guideline 5.1.1 (Data Collection) : respect strict du consentement utilisateur.</li>
                  <li className="flex items-center gap-2">✓ Guideline 2.1 (Performance) : mode local de secours assurant un fonctionnement sans coupure réseau.</li>
                  <li className="flex items-center gap-2">✓ Guideline 4.0 (Design) : ergonomie léchée, typographie équilibrée, absence de bouton inactif.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 4. CHARTE GRAPHIQUE */}
        {activeDoc === 'charte' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-base">
              <Palette className="w-5 h-5" />
              <h3>Charte Graphique Officielle – Saviora IA</h3>
            </div>

            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              L'univers visuel de Saviora IA allie la solennité des grands cercles éditoriaux et l'énergie des réseaux d'intelligence numérique.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8]'}`}>
                <div className="w-full h-10 rounded bg-[#0B1B3A] border border-white/20 mb-2"></div>
                <div className={`font-bold text-xs ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>Bleu Nuit</div>
                <div className="text-[11px] font-mono text-[#D4AF37]">#0B1B3A</div>
                <div className="text-[10px] text-slate-500 mt-1">Fond & Surfaces (60%)</div>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8]'}`}>
                <div className="w-full h-10 rounded bg-[#12305F] mb-2"></div>
                <div className={`font-bold text-xs ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>Bleu Profond</div>
                <div className="text-[11px] font-mono text-[#D4AF37]">#12305F</div>
                <div className="text-[10px] text-slate-500 mt-1">Bordures & Cartes (30%)</div>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8]'}`}>
                <div className="w-full h-10 rounded bg-[#D4AF37] mb-2"></div>
                <div className="font-bold text-xs text-[#0B1B3A] bg-[#D4AF37] px-1 rounded inline-block">Or Saviora</div>
                <div className="text-[11px] font-mono text-[#D4AF37]">#D4AF37</div>
                <div className="text-[10px] text-slate-500 mt-1">Accents primaires (10%)</div>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8]'}`}>
                <div className="w-full h-10 rounded bg-[#F8F5EC] border border-slate-300 mb-2"></div>
                <div className={`font-bold text-xs ${isDark ? 'text-[#081226] bg-[#F8F5EC]' : 'text-[#0B1B3A] bg-[#F8F5EC]'} px-1 rounded inline-block`}>Ivoire Pur</div>
                <div className="text-[11px] font-mono text-[#D4AF37]">#F8F5EC</div>
                <div className="text-[10px] text-slate-500 mt-1">Typographie & Thème Clair</div>
              </div>
            </div>
          </div>
        )}

        {/* 5. POLITIQUE DE CONFIDENTIALITÉ */}
        {activeDoc === 'confidentialite' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-base">
              <Shield className="w-5 h-5" />
              <h3>Politique de Confidentialité (Conforme RGPD)</h3>
            </div>

            <p className="text-xs text-slate-500">
              Dernière révision : 16 octobre 2026.
            </p>

            <div className={`space-y-3 text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>
                <strong>1. Traitement des données locales :</strong> Vos listes d'outils favoris et sélections du comparateur ne transitent par aucun serveur distant. Elles sont enregistrées dans le stockage local de votre navigateur/terminal.
              </p>
              <p>
                <strong>2. Requêtes à l'assistant de recommandation :</strong> Lorsque vous formulez une question à l'assistant, votre requête est analysée de manière confidentielle afin de déterminer les suggestions d'outils. En mode local de secours, aucun paquet réseau n'est envoyé.
              </p>
              <p>
                <strong>3. Traceurs et cookies publicitaires :</strong> Saviora IA n'utilise aucun traceur publicitaire tiers, ni régie de ciblage comportemental.
              </p>
              <p>
                <strong>4. Exercice de vos droits :</strong> Vous pouvez exercer vos droits d'accès ou de rectification auprès de notre référent à l'adresse <code>{CONFIG.supportEmail}</code>.
              </p>
            </div>
          </div>
        )}

        {/* 6. CONDITIONS D'UTILISATION */}
        {activeDoc === 'conditions' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-base">
              <FileText className="w-5 h-5" />
              <h3>Conditions Générales d'Utilisation (CGU)</h3>
            </div>

            <div className={`space-y-3 text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>
                <strong>1. Objet du service :</strong> Saviora IA fournit un répertoire d'informations, de comparatifs et de recommandations sur les outils d'intelligence artificielle et logiciels du marché francophone et international.
              </p>
              <p>
                <strong>2. Exactitude des tarifs :</strong> Les prix indicatifs et fonctionnalités des éditeurs tiers sont soumis à des évolutions fréquentes. Saviora IA effectue des contrôles réguliers mais invite l'utilisateur à vérifier les conditions contractuelles finales sur les sites officiels des éditeurs respectifs.
              </p>
              <p>
                <strong>3. Propriété intellectuelle :</strong> Les logos et marques cités demeurent la propriété exclusive de leurs éditeurs légaux.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
