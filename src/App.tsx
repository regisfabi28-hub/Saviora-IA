/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ToolCard } from './components/ToolCard';
import { ToolDetailModal } from './components/ToolDetailModal';
import { ComparatorView } from './components/ComparatorView';
import { AssistantView } from './components/AssistantView';
import { FavoritesView } from './components/FavoritesView';
import { DocumentationView } from './components/DocumentationView';
import { Tool } from './types/tool';
import { CATALOGUE_OUTILS_IA, CATEGORIES_LIST, MODELES_ECONOMIQUES } from './data/tools';
import { getStoredFavorites, toggleFavorite, clearAllUserData, mergeFavorites } from './services/favorites';
import { CONFIG } from './core/config';
import { useTheme } from './context/ThemeContext';
import { CheckCircle2, SlidersHorizontal, ArrowUpDown, RefreshCw, Sparkles, GitCompare } from 'lucide-react';

export default function App() {
  const { theme, isDark, palette } = useTheme();

  const [currentTab, setCurrentTab] = useState<'annuaire' | 'comparateur' | 'assistant' | 'favoris' | 'reglages'>('annuaire');
  const [docInitialSubTab, setDocInitialSubTab] = useState<'reglages' | 'methode' | 'stores' | 'charte' | 'confidentialite' | 'conditions'>('reglages');
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [selectedEconomicModel, setSelectedEconomicModel] = useState<string>('Tous');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [frenchOnly, setFrenchOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popularite' | 'note' | 'recent' | 'nom'>('popularite');

  // Favorites state (local storage)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Comparator state (max 3 tools)
  const [comparatorTools, setComparatorTools] = useState<Tool[]>([]);

  // Tool Detail Modal state
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Initialize favorites from localStorage on mount & handle incoming multi-device sync URL
  useEffect(() => {
    const existing = getStoredFavorites();
    
    // Check for sync URL parameters (e.g. ?sync_favoris=chatgpt,claude) or shared tool link (?outil=chatgpt)
    try {
      const params = new URLSearchParams(window.location.search);
      const syncParam = params.get('sync_favoris');
      if (syncParam) {
        const ids = syncParam.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
        if (ids.length > 0) {
          const merged = mergeFavorites(ids);
          setFavoriteIds(merged);
          setSyncToastMessage(`${ids.length} favori(s) synchronisé(s) depuis votre autre appareil !`);
          setCurrentTab('favoris');
          window.history.replaceState({}, '', window.location.pathname);
          setTimeout(() => setSyncToastMessage(null), 6000);
          return;
        }
      }

      // Check if user came from a social share link for a specific tool
      const toolParam = params.get('outil') || params.get('tool');
      if (toolParam) {
        const found = CATALOGUE_OUTILS_IA.find(t => t.id === toolParam.toLowerCase());
        if (found) {
          setSelectedTool(found);
        }
      }
    } catch (e) {
      // Ignore
    }

    setFavoriteIds(existing);
  }, []);

  const handleImportFavorites = (newIds: string[]) => {
    const merged = mergeFavorites(newIds);
    setFavoriteIds(merged);
  };

  const handleToggleFavorite = (id: string) => {
    const res = toggleFavorite(id);
    setFavoriteIds(res.list);
  };

  const handleToggleComparator = (tool: Tool) => {
    setComparatorTools(prev => {
      const exists = prev.some(t => t.id === tool.id);
      if (exists) {
        return prev.filter(t => t.id !== tool.id);
      } else {
        if (prev.length >= 3) {
          alert("Le comparateur permet d'examiner jusqu'à 3 outils simultanément. Veuillez en retirer un avant d'en ajouter un nouveau.");
          return prev;
        }
        return [...prev, tool];
      }
    });
  };

  const handleRemoveFromComparator = (id: string) => {
    setComparatorTools(prev => prev.filter(t => t.id !== id));
  };

  const handleClearAllData = () => {
    clearAllUserData();
    setFavoriteIds([]);
    setComparatorTools([]);
  };

  const openSettings = () => {
    setDocInitialSubTab('reglages');
    setCurrentTab('reglages');
  };

  // Filtered and sorted tools for the main directory
  const filteredTools = useMemo(() => {
    return CATALOGUE_OUTILS_IA.filter(tool => {
      // Search query (name, description, tags, use cases)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = tool.nom.toLowerCase().includes(q);
        const inDesc = tool.description_courte.toLowerCase().includes(q) || tool.description_detaillee.toLowerCase().includes(q);
        const inTags = tool.tags.some(t => t.toLowerCase().includes(q));
        const inUsages = tool.cas_usage.some(u => u.toLowerCase().includes(q));
        if (!inName && !inDesc && !inTags && !inUsages) return false;
      }

      // Category filter
      if (selectedCategory !== 'Toutes' && tool.categorie !== selectedCategory) {
        return false;
      }

      // Economic model filter
      if (selectedEconomicModel !== 'Tous' && tool.modele_economique !== selectedEconomicModel) {
        return false;
      }

      // Verified filter
      if (verifiedOnly && !tool.verifie) {
        return false;
      }

      // French support filter
      if (frenchOnly && tool.support_francais !== 'Complet') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popularite') return b.popularite - a.popularite;
      if (sortBy === 'note') return b.note_globale - a.note_globale;
      if (sortBy === 'recent') {
        if (a.verifie && !b.verifie) return -1;
        if (!a.verifie && b.verifie) return 1;
        return (b.derniere_verification || '').localeCompare(a.derniere_verification || '');
      }
      if (sortBy === 'nom') return a.nom.localeCompare(b.nom);
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedEconomicModel, verifiedOnly, frenchOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Toutes');
    setSelectedEconomicModel('Tous');
    setVerifiedOnly(false);
    setFrenchOnly(false);
    setSortBy('popularite');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDark ? 'bg-[#081226] text-[#F8F5EC]' : 'bg-[#F8F5EC] text-[#0B1B3A]'
    } selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]`}>
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        favoritesCount={favoriteIds.length}
        comparatorCount={comparatorTools.length}
        onOpenSettings={openSettings}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Multi-Device Synchronisation Toast Notification */}
        {syncToastMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/80 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-medium">{syncToastMessage}</span>
            </div>
            <button
              onClick={() => setSyncToastMessage(null)}
              className="text-xs text-emerald-400 hover:text-white px-2 py-1 rounded cursor-pointer"
            >
              Fermer
            </button>
          </div>
        )}

        {currentTab === 'annuaire' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={setVerifiedOnly}
              onOpenAssistant={() => setCurrentTab('assistant')}
            />

            {/* Interactive Filter Controls: Category Segmented Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[#D4AF37]">Filtrer par catégorie</span>
                <span className="font-mono tabular-nums">{filteredTools.length} / 200 outils affichés</span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES_LIST.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      selectedCategory === category
                        ? 'bg-[#D4AF37] text-[#0B1B3A] font-semibold shadow-xs'
                        : isDark
                          ? 'bg-[#0B1B3A] text-slate-300 hover:text-white border border-[#12305F]'
                          : 'bg-[#FFFFFF] text-slate-700 hover:text-[#0B1B3A] border border-[#E2D9C8] shadow-2xs'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Controls Bar: Economic Model, French toggle, Sort & Reset */}
            <div className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border text-xs transition ${
              isDark
                ? 'bg-[#0B1B3A] border-[#12305F] text-slate-300'
                : 'bg-[#FFFFFF] border-[#E2D9C8] text-slate-700 shadow-xs'
            }`}>
              <div className="flex flex-wrap items-center gap-3">
                {/* Modèle économique */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Tarification :</span>
                  <select
                    value={selectedEconomicModel}
                    onChange={(e) => setSelectedEconomicModel(e.target.value)}
                    className={`border rounded-md px-2 py-1 focus:outline-none focus:border-[#D4AF37] cursor-pointer ${
                      isDark
                        ? 'bg-[#081226] border-[#12305F] text-[#F8F5EC]'
                        : 'bg-[#F8F5EC] border-[#E2D9C8] text-[#0B1B3A]'
                    }`}
                  >
                    {MODELES_ECONOMIQUES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Filtre français complet */}
                <button
                  onClick={() => setFrenchOnly(!frenchOnly)}
                  className={`px-2.5 py-1 rounded-md border transition cursor-pointer ${
                    frenchOnly
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 font-semibold'
                      : isDark
                        ? 'border-[#12305F] text-slate-400 hover:text-white'
                        : 'border-[#E2D9C8] text-slate-600 hover:text-[#0B1B3A]'
                  }`}
                >
                  Français complet uniquement
                </button>

                {/* Filtre fiches vérifiées */}
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md border transition cursor-pointer ${
                    verifiedOnly
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] font-semibold'
                      : isDark
                        ? 'border-[#12305F] text-slate-400 hover:text-white'
                        : 'border-[#E2D9C8] text-slate-600 hover:text-[#0B1B3A]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Vérifiées (52)</span>
                </button>
              </div>

              {/* Tri & Réinitialisation */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500">Trier par :</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`border rounded-md px-2 py-1 focus:outline-none focus:border-[#D4AF37] cursor-pointer ${
                      isDark
                        ? 'bg-[#081226] border-[#12305F] text-[#F8F5EC]'
                        : 'bg-[#F8F5EC] border-[#E2D9C8] text-[#0B1B3A]'
                    }`}
                  >
                    <option value="popularite">Popularité</option>
                    <option value="note">Meilleure note</option>
                    <option value="recent">Récemment vérifié</option>
                    <option value="nom">Nom alphabétique</option>
                  </select>
                </div>

                {(searchQuery || selectedCategory !== 'Toutes' || selectedEconomicModel !== 'Tous' || verifiedOnly || frenchOnly) && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Réinitialiser</span>
                  </button>
                )}
              </div>
            </div>

            {/* Floating Comparator Ribbon if tools are selected */}
            {comparatorTools.length > 0 && (
              <div className={`sticky top-16 z-30 flex items-center justify-between gap-4 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition ${
                isDark
                  ? 'bg-[#0B1B3A]/95 border-[#D4AF37]/60 text-[#F8F5EC]'
                  : 'bg-[#FFFFFF]/95 border-[#D4AF37] text-[#0B1B3A]'
              }`}>
                <div className="flex items-center gap-3 text-xs">
                  <GitCompare className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    <strong>{comparatorTools.length} outil{comparatorTools.length > 1 ? 's' : ''}</strong> dans le comparateur : {comparatorTools.map(t => t.nom).join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentTab('comparateur')}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0B1B3A] bg-[#D4AF37] hover:bg-[#e4be42] rounded-lg transition cursor-pointer shadow-xs"
                  >
                    Ouvrir la comparaison →
                  </button>
                  <button
                    onClick={() => setComparatorTools([])}
                    className="text-xs text-slate-400 hover:text-black dark:hover:text-white px-2 py-1 cursor-pointer"
                  >
                    Vider
                  </button>
                </div>
              </div>
            )}

            {/* Tools Grid */}
            {filteredTools.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl border transition ${
                isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8] shadow-xs'
              }`}>
                <SlidersHorizontal className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>
                  Aucun outil ne correspond à vos filtres
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5">
                  Modifiez vos critères de recherche ou réinitialisez les filtres pour explorer l'ensemble des 200 outils.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-semibold text-[#0B1B3A] bg-[#D4AF37] rounded-lg hover:bg-[#e4be42] transition cursor-pointer shadow-xs"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isFavorite={favoriteIds.includes(tool.id)}
                    isInComparator={comparatorTools.some(t => t.id === tool.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleComparator={handleToggleComparator}
                    onSelect={(t) => setSelectedTool(t)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMPARATEUR VIEW */}
        {currentTab === 'comparateur' && (
          <ComparatorView
            selectedTools={comparatorTools}
            onRemoveTool={handleRemoveFromComparator}
            onAddTool={handleToggleComparator}
            onSelectTool={(t) => setSelectedTool(t)}
            onSwitchToCatalog={() => setCurrentTab('annuaire')}
          />
        )}

        {/* ASSISTANT VIEW */}
        {currentTab === 'assistant' && (
          <AssistantView
            onSelectTool={(t) => setSelectedTool(t)}
            onAddToComparator={handleToggleComparator}
          />
        )}

        {/* FAVORIS VIEW */}
        {currentTab === 'favoris' && (
          <FavoritesView
            favoriteIds={favoriteIds}
            allTools={CATALOGUE_OUTILS_IA}
            comparatorIds={comparatorTools.map(t => t.id)}
            onToggleFavorite={handleToggleFavorite}
            onToggleComparator={handleToggleComparator}
            onSelectTool={(t) => setSelectedTool(t)}
            onClearFavorites={handleClearAllData}
            onSwitchToCatalog={() => setCurrentTab('annuaire')}
            onImportFavorites={handleImportFavorites}
          />
        )}

        {/* RÉGLAGES & DOCUMENTATION VIEW */}
        {currentTab === 'reglages' && (
          <DocumentationView
            initialSubTab={docInitialSubTab}
            onClearAllData={handleClearAllData}
          />
        )}
      </main>

      {/* Tool Detail Modal */}
      <ToolDetailModal
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
        isFavorite={selectedTool ? favoriteIds.includes(selectedTool.id) : false}
        isInComparator={selectedTool ? comparatorTools.some(t => t.id === selectedTool.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onToggleComparator={handleToggleComparator}
        onSelectAlternative={(altName) => {
          const found = CATALOGUE_OUTILS_IA.find(t => t.nom.toLowerCase() === altName.toLowerCase());
          if (found) {
            setSelectedTool(found);
          }
        }}
        onOpenMethodology={() => {
          setSelectedTool(null);
          setDocInitialSubTab('methode');
          setCurrentTab('reglages');
        }}
      />

      {/* Quiet Footer */}
      <footer className={`border-t mt-16 py-10 px-4 sm:px-6 text-xs transition ${
        isDark
          ? 'border-[#12305F]/80 bg-[#0B1B3A] text-slate-400'
          : 'border-[#E2D9C8] bg-[#FFFFFF] text-slate-600 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className={`font-bold text-sm ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>
              Saviora <span className="text-[#D4AF37]">IA</span>
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span>Annuaire francophone indépendant d'intelligence artificielle & logiciels</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span>Édition 2026 (v0.1)</span>
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <button
              onClick={() => {
                setDocInitialSubTab('methode');
                setCurrentTab('reglages');
              }}
              className="hover:text-[#D4AF37] transition cursor-pointer"
            >
              Méthodologie
            </button>
            <button
              onClick={() => {
                setDocInitialSubTab('confidentialite');
                setCurrentTab('reglages');
              }}
              className="hover:text-[#D4AF37] transition cursor-pointer"
            >
              Confidentialité
            </button>
            <button
              onClick={() => {
                setDocInitialSubTab('conditions');
                setCurrentTab('reglages');
              }}
              className="hover:text-[#D4AF37] transition cursor-pointer"
            >
              Conditions
            </button>
            <button
              onClick={openSettings}
              className="hover:text-[#D4AF37] font-semibold transition cursor-pointer flex items-center gap-1 text-[#D4AF37]"
            >
              <span>Réglages & Thème ({isDark ? 'Sombre' : 'Clair'})</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
