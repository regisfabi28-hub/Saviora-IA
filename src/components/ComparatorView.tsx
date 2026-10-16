import React from 'react';
import { GitCompare, X, Plus, ExternalLink, Star, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Tool } from '../types/tool';
import { CATALOGUE_OUTILS_IA } from '../data/tools';
import { useTheme } from '../context/ThemeContext';

interface ComparatorViewProps {
  selectedTools: Tool[];
  onRemoveTool: (id: string) => void;
  onAddTool: (tool: Tool) => void;
  onSelectTool: (tool: Tool) => void;
  onSwitchToCatalog: () => void;
}

export const ComparatorView: React.FC<ComparatorViewProps> = ({
  selectedTools,
  onRemoveTool,
  onAddTool,
  onSelectTool,
  onSwitchToCatalog,
}) => {
  const { theme, isDark } = useTheme();

  // Available tools not yet in comparator
  const availableTools = CATALOGUE_OUTILS_IA.filter(
    t => !selectedTools.some(s => s.id === t.id)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 transition-colors ${
        isDark ? 'border-[#12305F]' : 'border-[#E2D9C8]'
      }`}>
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Comparateur d'Outils IA</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'
          }`}>
            Comparez 2 à 3 solutions côte à côte
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Évaluez objectivement les modèles économiques, le support du français et les limites opérationnelles.
          </p>
        </div>

        {selectedTools.length < 3 && (
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                const found = CATALOGUE_OUTILS_IA.find(t => t.id === e.target.value);
                if (found) onAddTool(found);
                e.target.value = '';
              }}
              defaultValue=""
              className={`text-xs rounded-lg px-3 py-2 border focus:outline-none focus:border-[#D4AF37] cursor-pointer transition ${
                isDark
                  ? 'bg-[#0B1B3A] border-[#12305F] text-[#F8F5EC]'
                  : 'bg-[#FFFFFF] border-[#E2D9C8] text-[#0B1B3A] shadow-xs'
              }`}
            >
              <option value="" disabled>+ Ajouter un outil au comparateur</option>
              {availableTools.map(t => (
                <option key={t.id} value={t.id}>
                  {t.nom} ({t.categorie} · {t.modele_economique})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedTools.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border transition ${
          isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8] shadow-xs'
        }`}>
          <GitCompare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>
            Aucun outil sélectionné pour l'instant
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Parcourez notre annuaire pour ajouter 2 à 3 outils à comparer, ou choisissez des suggestions ci-dessous.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={onSwitchToCatalog}
              className="px-4 py-2 text-xs font-semibold text-[#0B1B3A] bg-[#D4AF37] rounded-lg hover:bg-[#e4be42] transition cursor-pointer shadow-xs"
            >
              Parcourir l'annuaire complet
            </button>
            <button
              onClick={() => {
                const toolA = CATALOGUE_OUTILS_IA.find(t => t.id === 'chatgpt');
                const toolB = CATALOGUE_OUTILS_IA.find(t => t.id === 'claude');
                const toolC = CATALOGUE_OUTILS_IA.find(t => t.id === 'mistral-le-chat');
                if (toolA) onAddTool(toolA);
                if (toolB) onAddTool(toolB);
                if (toolC) onAddTool(toolC);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                isDark
                  ? 'text-[#F8F5EC] bg-[#12305F] hover:border-[#D4AF37] border-transparent'
                  : 'text-[#0B1B3A] bg-[#F8F5EC] hover:border-[#D4AF37] border-[#E2D9C8]'
              }`}
            >
              Exemple : ChatGPT vs Claude vs Mistral
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Comparative Grid Table */}
          <div className={`overflow-x-auto rounded-2xl border transition ${
            isDark ? 'border-[#12305F] bg-[#0B1B3A]' : 'border-[#E2D9C8] bg-[#FFFFFF] shadow-xs'
          }`}>
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className={`border-b transition ${
                  isDark ? 'border-[#12305F] bg-[#081226]/80' : 'border-[#E2D9C8] bg-[#F8F5EC]'
                }`}>
                  <th className="p-4 sm:p-5 w-48 text-slate-500 font-medium">Critères d'évaluation</th>
                  {selectedTools.map(tool => (
                    <th key={tool.id} className="p-4 sm:p-5 min-w-[240px] align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs text-[#D4AF37] font-semibold">{tool.categorie}</div>
                          <div 
                            onClick={() => onSelectTool(tool)}
                            className={`text-lg font-bold hover:text-[#D4AF37] cursor-pointer transition ${
                              isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'
                            }`}
                          >
                            {tool.nom}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[#D4AF37] font-mono mt-0.5">
                            <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                            <span>{tool.note_globale.toFixed(1)} / 5</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveTool(tool.id)}
                          className={`p-1 rounded transition cursor-pointer ${
                            isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800' : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                          }`}
                          title="Retirer du comparateur"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                  {selectedTools.length < 3 && (
                    <th className={`p-4 sm:p-5 min-w-[200px] border-l border-dashed text-center align-middle ${
                      isDark ? 'border-[#12305F]' : 'border-[#E2D9C8]'
                    }`}>
                      <div className="p-4 text-center">
                        <Plus className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <span className="text-xs text-slate-500 block mb-2">Comparer un autre outil</span>
                        <select
                          onChange={(e) => {
                            const found = CATALOGUE_OUTILS_IA.find(t => t.id === e.target.value);
                            if (found) onAddTool(found);
                            e.target.value = '';
                          }}
                          defaultValue=""
                          className={`text-xs rounded px-2.5 py-1.5 border focus:outline-none focus:border-[#D4AF37] cursor-pointer max-w-full ${
                            isDark
                              ? 'bg-[#081226] border-[#12305F] text-[#F8F5EC]'
                              : 'bg-[#F8F5EC] border-[#E2D9C8] text-[#0B1B3A]'
                          }`}
                        >
                          <option value="" disabled>Sélectionner...</option>
                          {availableTools.map(t => (
                            <option key={t.id} value={t.id}>{t.nom}</option>
                          ))}
                        </select>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className={`divide-y transition ${
                isDark ? 'divide-[#12305F]/60 text-slate-300' : 'divide-[#E2D9C8] text-slate-700'
              }`}>
                {/* Modèle économique */}
                <tr>
                  <td className={`p-4 sm:p-5 font-semibold ${
                    isDark ? 'text-slate-400 bg-[#081226]/40' : 'text-slate-600 bg-[#F8F5EC]/50'
                  }`}>Modèle économique</td>
                  {selectedTools.map(tool => (
                    <td key={tool.id} className={`p-4 sm:p-5 font-medium ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>
                      {tool.modele_economique}
                    </td>
                  ))}
                  {selectedTools.length < 3 && <td className={`p-4 sm:p-5 border-l border-dashed ${isDark ? 'border-[#12305F]/50' : 'border-[#E2D9C8]'}`}></td>}
                </tr>

                {/* Tarif indicatif */}
                <tr>
                  <td className={`p-4 sm:p-5 font-semibold ${
                    isDark ? 'text-slate-400 bg-[#081226]/40' : 'text-slate-600 bg-[#F8F5EC]/50'
                  }`}>Tarif indicatif</td>
                  {selectedTools.map(tool => (
                    <td key={tool.id} className="p-4 sm:p-5 font-mono tabular-nums text-[#D4AF37] font-semibold">
                      {tool.prix_indicatif}
                    </td>
                  ))}
                  {selectedTools.length < 3 && <td className={`p-4 sm:p-5 border-l border-dashed ${isDark ? 'border-[#12305F]/50' : 'border-[#E2D9C8]'}`}></td>}
                </tr>

                {/* Support langue française */}
                <tr>
                  <td className={`p-4 sm:p-5 font-semibold ${
                    isDark ? 'text-slate-400 bg-[#081226]/40' : 'text-slate-600 bg-[#F8F5EC]/50'
                  }`}>Prise en charge du français</td>
                  {selectedTools.map(tool => (
                    <td key={tool.id} className="p-4 sm:p-5">
                      <span className={tool.support_francais === 'Complet' ? 'text-emerald-500 font-semibold' : 'text-slate-500'}>
                        {tool.support_francais}
                      </span>
                    </td>
                  ))}
                  {selectedTools.length < 3 && <td className={`p-4 sm:p-5 border-l border-dashed ${isDark ? 'border-[#12305F]/50' : 'border-[#E2D9C8]'}`}></td>}
                </tr>

                {/* Description synthétique */}
                <tr>
                  <td className={`p-4 sm:p-5 font-semibold ${
                    isDark ? 'text-slate-400 bg-[#081226]/40' : 'text-slate-600 bg-[#F8F5EC]/50'
                  }`}>Description & Rôle</td>
                  {selectedTools.map(tool => (
                    <td key={tool.id} className="p-4 sm:p-5 leading-relaxed text-xs">
                      {tool.description_courte}
                    </td>
                  ))}
                  {selectedTools.length < 3 && <td className={`p-4 sm:p-5 border-l border-dashed ${isDark ? 'border-[#12305F]/50' : 'border-[#E2D9C8]'}`}></td>}
                </tr>

                {/* Points forts */}
                <tr>
                  <td className={`p-4 sm:p-5 font-semibold ${
                    isDark ? 'text-slate-400 bg-[#081226]/40' : 'text-slate-600 bg-[#F8F5EC]/50'
                  }`}>Points forts clés</td>
                  {selectedTools.map(tool => (
                    <td key={tool.id} className="p-4 sm:p-5 align-top">
                      <ul className="space-y-1.5 text-xs">
                        {tool.points_forts.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-emerald-500">
                            <span>✓</span>
                            <span className={isDark ? 'text-[#F8F5EC]' : 'text-slate-700'}>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {selectedTools.length < 3 && <td className={`p-4 sm:p-5 border-l border-dashed ${isDark ? 'border-[#12305F]/50' : 'border-[#E2D9C8]'}`}></td>}
                </tr>

                {/* Limites & Compromis */}
                <tr>
                  <td className={`p-4 sm:p-5 font-semibold ${
                    isDark ? 'text-slate-400 bg-[#081226]/40' : 'text-slate-600 bg-[#F8F5EC]/50'
                  }`}>Limites & Vigilance</td>
                  {selectedTools.map(tool => (
                    <td key={tool.id} className="p-4 sm:p-5 align-top">
                      <ul className="space-y-1.5 text-xs">
                        {tool.limites.map((lim, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-amber-500">
                            <span>⚠</span>
                            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {selectedTools.length < 3 && <td className={`p-4 sm:p-5 border-l border-dashed ${isDark ? 'border-[#12305F]/50' : 'border-[#E2D9C8]'}`}></td>}
                </tr>

                {/* Statut d'audit */}
                <tr>
                  <td className={`p-4 sm:p-5 font-semibold ${
                    isDark ? 'text-slate-400 bg-[#081226]/40' : 'text-slate-600 bg-[#F8F5EC]/50'
                  }`}>Audit Saviora IA</td>
                  {selectedTools.map(tool => (
                    <td key={tool.id} className="p-4 sm:p-5 text-xs">
                      {tool.verifie ? (
                        <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>Audit vérifié ({tool.derniere_verification})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-500 font-medium">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>En cours de validation</span>
                        </div>
                      )}
                    </td>
                  ))}
                  {selectedTools.length < 3 && <td className={`p-4 sm:p-5 border-l border-dashed ${isDark ? 'border-[#12305F]/50' : 'border-[#E2D9C8]'}`}></td>}
                </tr>

                {/* Lien officiel */}
                <tr>
                  <td className={`p-4 sm:p-5 font-semibold ${
                    isDark ? 'text-slate-400 bg-[#081226]/40' : 'text-slate-600 bg-[#F8F5EC]/50'
                  }`}>Accès direct</td>
                  {selectedTools.map(tool => (
                    <td key={tool.id} className="p-4 sm:p-5">
                      <a
                        href={tool.url_officielle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0B1B3A] bg-[#D4AF37] hover:bg-[#e4be42] rounded-lg transition shadow-xs"
                      >
                        <span>Visiter {tool.nom}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  ))}
                  {selectedTools.length < 3 && <td className={`p-4 sm:p-5 border-l border-dashed ${isDark ? 'border-[#12305F]/50' : 'border-[#E2D9C8]'}`}></td>}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Synthetic Verdict Callout */}
          <div className={`p-6 rounded-2xl border text-xs sm:text-sm transition ${
            isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8] shadow-xs'
          }`}>
            <h4 className="font-bold text-[#D4AF37] text-base mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#D4AF37]" />
              <span>Verdict comparatif Saviora IA</span>
            </h4>
            <p className={`leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {selectedTools.length === 2 && (
                <>
                  Entre <strong>{selectedTools[0].nom}</strong> et <strong>{selectedTools[1].nom}</strong> : si votre priorité est la gratuité ou la prise en main rapide, privilégiez le modèle {selectedTools[0].modele_economique === 'Gratuit' || selectedTools[0].modele_economique === 'Freemium' ? selectedTools[0].nom : selectedTools[1].nom}. Pour un usage professionnel intensif, considérez la note d'évaluation et l'étendue du support français.
                </>
              )}
              {selectedTools.length === 3 && (
                <>
                  Sur ce trio (<strong>{selectedTools.map(t => t.nom).join(', ')}</strong>) : comparez attentivement les limites opérationnelles. Chaque outil répond à une facette particulière de productivité ; pensez à tester les versions freemium ou d'évaluation avant tout engagement annuel.
                </>
              )}
              {selectedTools.length === 1 && (
                <>
                  Ajoutez au moins un second outil pour obtenir une synthèse comparative détaillée.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
