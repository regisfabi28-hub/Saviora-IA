import React, { useState } from 'react';
import { Sparkles, Send, ShieldCheck, Cpu, RefreshCw, Star, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { Tool, AssistantRecommendationResponse } from '../types/tool';
import { CATALOGUE_OUTILS_IA, CATEGORIES_LIST } from '../data/tools';
import { useTheme } from '../context/ThemeContext';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  recommendedToolIds?: string[];
  mode?: 'gemini-serveur' | 'local-secours';
}

interface AssistantViewProps {
  onSelectTool: (tool: Tool) => void;
  onAddToComparator: (tool: Tool) => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  onSelectTool,
  onAddToComparator,
}) => {
  const { isDark } = useTheme();

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Bonjour ! Je suis l'assistant de recommandation Saviora IA. Décrivez-moi votre projet, vos contraintes de budget ou vos préférences linguistiques, et je vous recommanderai les outils les plus pertinents parmi notre catalogue vérifié.",
      recommendedToolIds: ['chatgpt', 'mistral-le-chat', 'photoroom'],
      mode: 'gemini-serveur'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [selectedBudget, setSelectedBudget] = useState<string>('tous');
  const [frenchOnly, setFrenchOnly] = useState<boolean>(true);
  const [useLocalOnly, setUseLocalOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const quickPrompts = [
    "Créer des vidéos avec avatars en français sous la barre des 30 €/mois",
    "Rédiger et optimiser des articles pour le référencement Google SEO",
    "Générer du code et corriger des bugs dans mon projet",
    "Isoler la voix et les instruments d'un morceau de musique",
    "Enregistrer et transcrire mes réunions professionnelles sans frais"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: Message = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    if (useLocalOnly) {
      setTimeout(() => {
        const localResp = runLocalMatching(text, selectedCategory, selectedBudget, frenchOnly);
        setMessages(prev => [...prev, {
          sender: 'assistant',
          text: localResp.reponse,
          recommendedToolIds: localResp.outils_recommandes,
          mode: 'local-secours'
        }]);
        setIsLoading(false);
      }, 400);
      return;
    }

    try {
      const res = await fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          besoin_utilisateur: text,
          categorie: selectedCategory !== 'Toutes' ? selectedCategory : undefined,
          budget_max_mensuel: selectedBudget === 'gratuit' ? 0 : (selectedBudget === 'modere' ? 25 : undefined),
          support_francais_obligatoire: frenchOnly,
          mode_local_uniquement: false
        })
      });

      if (!res.ok) {
        throw new Error(`Erreur serveur (${res.status})`);
      }

      const data: AssistantRecommendationResponse = await res.json();
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: data.reponse,
        recommendedToolIds: data.outils_recommandes,
        mode: data.mode
      }]);
    } catch (err) {
      const localResp = runLocalMatching(text, selectedCategory, selectedBudget, frenchOnly);
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: `[Bascule automatique en mode local de secours]\n\n${localResp.reponse}`,
        recommendedToolIds: localResp.outils_recommandes,
        mode: 'local-secours'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  function runLocalMatching(query: string, cat: string, budget: string, french: boolean) {
    const q = query.toLowerCase();
    const matches = CATALOGUE_OUTILS_IA.filter(tool => {
      if (cat !== 'Toutes' && tool.categorie !== cat) return false;
      if (french && tool.support_francais !== 'Complet') return false;
      if (budget === 'gratuit' && tool.modele_economique !== 'Gratuit' && tool.modele_economique !== 'Open Source') {
        return false;
      }
      if (budget === 'open-source' && tool.modele_economique !== 'Open Source') {
        return false;
      }
      return true;
    });

    const scored = matches.map(tool => {
      let score = tool.popularite * 0.1 + tool.note_globale;
      if (tool.nom.toLowerCase().includes(q)) score += 20;
      if (tool.description_courte.toLowerCase().includes(q) || tool.description_detaillee.toLowerCase().includes(q)) score += 10;
      if (tool.tags.some(t => q.includes(t.toLowerCase()))) score += 12;
      if (tool.cas_usage.some(u => q.includes(u.toLowerCase()))) score += 15;
      if (tool.verifie) score += 3;
      return { tool, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 3).map(s => s.tool);

    let answer = "";
    if (top.length > 0) {
      answer = `D'après notre catalogue, voici les outils les plus appropriés pour répondre à votre demande :\n\n`;
      answer += `• **${top[0].nom}** (${top[0].modele_economique}, ${top[0].prix_indicatif}) : ${top[0].description_courte}`;
      if (top[1]) {
        answer += `\n\n• **${top[1].nom}** (${top[1].modele_economique}, ${top[1].prix_indicatif}) : ${top[1].description_courte}`;
      }
      if (top[2]) {
        answer += `\n\n• **${top[2].nom}** : alternative performante notée ${top[2].note_globale}/5.`;
      }
    } else {
      answer = `Aucun outil ne satisfait tous vos filtres simultanément. Essayez d'élargir la catégorie ou de désactiver la restriction stricte de prix.`;
    }

    return {
      reponse: answer,
      outils_recommandes: top.map(t => t.id),
      mode: 'local-secours' as const
    };
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border transition-colors ${
        isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8] shadow-xs'
      }`}>
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assistant de Recommandation Saviora</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>
            Trouvez l'outil idéal selon votre besoin et votre budget
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Recommandations objectives fondées sur notre base de 200 outils rigoureusement classifiés.
          </p>
        </div>

        {/* Mode Selector Toggle */}
        <div className={`flex items-center gap-2 p-1.5 border rounded-xl self-start sm:self-center ${
          isDark ? 'bg-[#081226] border-[#12305F]' : 'bg-[#F8F5EC] border-[#E2D9C8]'
        }`}>
          <button
            onClick={() => setUseLocalOnly(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              !useLocalOnly
                ? isDark ? 'bg-[#12305F] text-[#D4AF37] shadow-sm font-semibold' : 'bg-white text-amber-800 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Serveur IA (Gemini)</span>
          </button>

          <button
            onClick={() => setUseLocalOnly(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              useLocalOnly
                ? isDark ? 'bg-[#12305F] text-[#D4AF37] shadow-sm font-semibold' : 'bg-white text-amber-800 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Mode Local de Secours</span>
          </button>
        </div>
      </div>

      {/* Filter Parameters Row */}
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border text-xs transition ${
        isDark ? 'bg-[#0B1B3A]/80 border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8] shadow-xs'
      }`}>
        <div>
          <label className="block text-slate-500 mb-1 font-medium">Catégorie cible :</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full rounded-lg px-2.5 py-1.5 border focus:outline-none focus:border-[#D4AF37] ${
              isDark
                ? 'bg-[#081226] border-[#12305F] text-[#F8F5EC]'
                : 'bg-[#F8F5EC] border-[#E2D9C8] text-[#0B1B3A]'
            }`}
          >
            {CATEGORIES_LIST.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-500 mb-1 font-medium">Fourchette de budget :</label>
          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className={`w-full rounded-lg px-2.5 py-1.5 border focus:outline-none focus:border-[#D4AF37] ${
              isDark
                ? 'bg-[#081226] border-[#12305F] text-[#F8F5EC]'
                : 'bg-[#F8F5EC] border-[#E2D9C8] text-[#0B1B3A]'
            }`}
          >
            <option value="tous">Tous budgets</option>
            <option value="gratuit">Gratuit uniquement</option>
            <option value="open-source">Open Source (gratuit)</option>
            <option value="modere">Modéré (Freemium &lt; 25 €/mois)</option>
          </select>
        </div>

        <div className="flex items-center sm:justify-center pt-4 sm:pt-2">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={frenchOnly}
              onChange={(e) => setFrenchOnly(e.target.checked)}
              className="accent-[#D4AF37] w-4 h-4 rounded cursor-pointer"
            />
            <span className={`font-medium ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>Support français complet requis</span>
          </label>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">Suggestions :</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              isDark
                ? 'bg-[#0B1B3A] border-[#12305F] hover:border-[#D4AF37] text-slate-300 hover:text-white'
                : 'bg-[#FFFFFF] border-[#E2D9C8] hover:border-[#D4AF37] text-slate-700 hover:text-[#0B1B3A] shadow-xs'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className={`p-6 rounded-2xl border space-y-6 min-h-[380px] transition ${
        isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8] shadow-xs'
      }`}>
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-2">
              <span>{m.sender === 'user' ? 'Vous' : 'Saviora IA'}</span>
              {m.mode && (
                <span className="text-[10px] text-[#D4AF37] font-mono">
                  [{m.mode === 'gemini-serveur' ? 'IA Gemini' : 'Mode local'}]
                </span>
              )}
            </div>

            <div
              className={`p-4 sm:p-5 rounded-2xl max-w-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? isDark ? 'bg-[#12305F] text-[#F8F5EC] rounded-tr-none' : 'bg-[#D4AF37] text-[#0B1B3A] font-medium rounded-tr-none'
                  : isDark ? 'bg-[#081226] text-[#F8F5EC] border border-[#12305F] rounded-tl-none' : 'bg-[#F8F5EC] text-[#0B1B3A] border border-[#E2D9C8] rounded-tl-none'
              }`}
            >
              {m.text}
            </div>

            {/* Recommended Tools Cards inside Assistant Response */}
            {m.recommendedToolIds && m.recommendedToolIds.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-4xl">
                {m.recommendedToolIds.map(id => {
                  const tool = CATALOGUE_OUTILS_IA.find(t => t.id === id);
                  if (!tool) return null;
                  return (
                    <div
                      key={tool.id}
                      className={`p-3.5 rounded-xl border hover:border-[#D4AF37] transition flex flex-col justify-between text-xs shadow-xs ${
                        isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-[#D4AF37] font-medium mb-1">
                          <span>{tool.categorie}</span>
                          <span className="font-mono text-slate-500">{tool.note_globale.toFixed(1)} ★</span>
                        </div>
                        <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>
                          {tool.nom}
                        </h4>
                        <p className="text-slate-500 line-clamp-2 text-[11px] mb-2 leading-relaxed">
                          {tool.description_courte}
                        </p>
                      </div>

                      <div className={`border-t pt-2 flex items-center justify-between gap-1 text-[11px] ${
                        isDark ? 'border-[#12305F]/60' : 'border-[#E2D9C8]'
                      }`}>
                        <button
                          onClick={() => onSelectTool(tool)}
                          className="text-[#D4AF37] hover:underline font-semibold cursor-pointer"
                        >
                          Fiche →
                        </button>
                        <button
                          onClick={() => onAddToComparator(tool)}
                          className="text-slate-500 hover:text-[#0B1B3A] dark:hover:text-white cursor-pointer"
                        >
                          + Comparer
                        </button>
                        <a
                          href={tool.url_officielle}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-[#0B1B3A] dark:hover:text-white"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#D4AF37] py-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>L'assistant Saviora IA analyse le catalogue...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className={`flex items-center gap-2 border focus-within:border-[#D4AF37] rounded-xl p-2 transition ${
          isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8] shadow-xs'
        }`}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ex: Quel outil me conseillez-vous pour sous-titrer des vidéos courtes en français avec un petit budget ?"
          className={`flex-1 bg-transparent text-xs sm:text-sm px-3 py-2 focus:outline-none ${
            isDark ? 'text-[#F8F5EC] placeholder:text-slate-500' : 'text-[#0B1B3A] placeholder:text-slate-400'
          }`}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#0B1B3A] font-semibold text-xs hover:bg-[#e4be42] disabled:opacity-40 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <span>Envoyer</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
