import React, { useState, useRef } from 'react';
import { Bookmark, Download, Upload, Trash2, Search, ArrowRight, ExternalLink, GitCompare, Share2, Copy, Check, Smartphone, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { Tool } from '../types/tool';
import { ToolCard } from './ToolCard';
import { useTheme } from '../context/ThemeContext';

interface FavoritesViewProps {
  favoriteIds: string[];
  allTools: Tool[];
  comparatorIds: string[];
  onToggleFavorite: (id: string) => void;
  onToggleComparator: (tool: Tool) => void;
  onSelectTool: (tool: Tool) => void;
  onClearFavorites: () => void;
  onSwitchToCatalog: () => void;
  onImportFavorites: (ids: string[]) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteIds,
  allTools,
  comparatorIds,
  onToggleFavorite,
  onToggleComparator,
  onSelectTool,
  onClearFavorites,
  onSwitchToCatalog,
  onImportFavorites,
}) => {
  const { isDark } = useTheme();
  const [filterQuery, setFilterQuery] = useState('');
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [importStatusMessage, setImportStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const favoriteTools = allTools.filter(t => favoriteIds.includes(t.id));
  const filtered = favoriteTools.filter(t =>
    t.nom.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.categorie.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.description_courte.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleExportJSON = () => {
    const exportData = {
      app: 'Saviora IA',
      version: '0.1.0',
      date: new Date().toISOString(),
      favorite_ids: favoriteIds,
      tools: favoriteTools.map(t => ({
        id: t.id,
        nom: t.nom,
        categorie: t.categorie,
        modele_economique: t.modele_economique,
        url_officielle: t.url_officielle
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `saviora_ia_mes_favoris_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        let idsToImport: string[] = [];

        if (Array.isArray(parsed)) {
          // Direct array of strings or tool objects
          idsToImport = parsed.map(item => (typeof item === 'string' ? item : item.id)).filter(Boolean);
        } else if (parsed && Array.isArray(parsed.favorite_ids)) {
          // Saviora export schema
          idsToImport = parsed.favorite_ids;
        } else if (parsed && Array.isArray(parsed.tools)) {
          idsToImport = parsed.tools.map((t: any) => t.id).filter(Boolean);
        }

        const validIds = idsToImport.filter(id => allTools.some(t => t.id === id));
        if (validIds.length > 0) {
          onImportFavorites(validIds);
          setImportStatusMessage({
            type: 'success',
            text: `${validIds.length} favori(s) synchronisé(s) et importé(s) avec succès !`
          });
        } else {
          setImportStatusMessage({
            type: 'error',
            text: "Aucun outil valide de notre catalogue n'a été trouvé dans ce fichier."
          });
        }
      } catch (err) {
        setImportStatusMessage({
          type: 'error',
          text: "Format de fichier invalide. Veuillez importer un fichier JSON Saviora."
        });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
        setTimeout(() => setImportStatusMessage(null), 5000);
      }
    };
    reader.readAsText(file);
  };

  // Direct multi-device link generator
  const getSyncLink = () => {
    if (favoriteIds.length === 0) return window.location.origin;
    const base = window.location.origin + window.location.pathname;
    return `${base}?sync_favoris=${favoriteIds.join(',')}`;
  };

  const handleCopySyncLink = () => {
    navigator.clipboard.writeText(getSyncLink());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleManualImportCode = () => {
    if (!manualCode.trim()) return;
    const cleaned = manualCode.trim().replace(/^saviora:/i, '');
    const candidateIds = cleaned.split(/[\s,;|]+/).map(s => s.trim().toLowerCase());
    const valid = candidateIds.filter(id => allTools.some(t => t.id === id));

    if (valid.length > 0) {
      onImportFavorites(valid);
      setImportStatusMessage({
        type: 'success',
        text: `${valid.length} favori(s) synchronisé(s) avec succès !`
      });
      setManualCode('');
      setShowSyncModal(false);
    } else {
      setImportStatusMessage({
        type: 'error',
        text: "Code invalide. Aucun identifiant d'outil valide n'a été reconnu."
      });
    }
    setTimeout(() => setImportStatusMessage(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Top Banner */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 transition ${
        isDark ? 'border-[#12305F]' : 'border-[#E2D9C8]'
      }`}>
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
            <Bookmark className="w-3.5 h-3.5 fill-[#D4AF37]" />
            <span>Vos Outils Enregistrés</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>
            Favoris ({favoriteTools.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stockés localement sur votre appareil sans transmission à des tiers. Synchronisables librement entre vos terminaux.
          </p>
        </div>

        {/* Global actions: Sync modal, Export, Import, Purge */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setShowSyncModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
              isDark
                ? 'text-[#D4AF37] bg-[#12305F] border-[#D4AF37]/50 hover:bg-[#1a427f]'
                : 'text-amber-900 bg-[#FFFFFF] border-[#D4AF37] hover:bg-[#F8F5EC] shadow-2xs'
            }`}
            title="Synchroniser vos favoris avec un smartphone ou un autre ordinateur"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Synchroniser multi-appareils</span>
          </button>

          {favoriteTools.length > 0 && (
            <button
              onClick={handleExportJSON}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                isDark
                  ? 'text-[#F8F5EC] bg-[#0B1B3A] border-[#12305F] hover:border-[#D4AF37]'
                  : 'text-[#0B1B3A] bg-[#FFFFFF] border-[#E2D9C8] hover:border-[#D4AF37] shadow-xs'
              }`}
              title="Télécharger vos favoris au format JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter JSON</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
              isDark
                ? 'text-slate-300 bg-[#0B1B3A] border-[#12305F] hover:text-white'
                : 'text-slate-700 bg-[#FFFFFF] border-[#E2D9C8] hover:text-black shadow-xs'
            }`}
            title="Importer un fichier de favoris JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importer JSON</span>
          </button>

          {favoriteTools.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir effacer tous vos favoris locaux ?")) {
                  onClearFavorites();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900 rounded-lg transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Effacer</span>
            </button>
          )}
        </div>
      </div>

      {/* Status banner on import */}
      {importStatusMessage && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 transition ${
          importStatusMessage.type === 'success'
            ? 'bg-emerald-950/40 border border-emerald-500/60 text-emerald-300'
            : 'bg-rose-950/40 border border-rose-500/60 text-rose-300'
        }`}>
          {importStatusMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{importStatusMessage.text}</span>
        </div>
      )}

      {/* MULTI-DEVICE SYNC MODAL */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className={`relative w-full max-w-xl rounded-2xl border p-6 sm:p-8 space-y-6 shadow-2xl transition ${
            isDark ? 'bg-[#0B1B3A] border-[#12305F] text-[#F8F5EC]' : 'bg-[#FFFFFF] border-[#E2D9C8] text-[#0B1B3A]'
          }`}>
            <div className="flex items-start justify-between border-b pb-4 border-slate-700/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Synchronisation & Transfert Multi-Appareils</h3>
                  <p className="text-xs text-slate-500">
                    Retrouvez vos outils enregistrés sur n'importe quel ordinateur, tablette ou smartphone.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Privacy callout */}
            <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
              isDark ? 'bg-[#081226] border-[#12305F] text-slate-300' : 'bg-[#F8F5EC] border-[#E2D9C8] text-slate-700'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-0.5 text-[#D4AF37]">Souveraineté des données garantie</strong>
                <span>
                  La synchronisation s'effectue directement via lien chiffré dans l'URL ou fichier local. Aucun compte distant ni serveur cloud obligatoire : vous gardez le contrôle absolu sur votre sélection.
                </span>
              </div>
            </div>

            {/* Option 1: Direct link share */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Option 1 : Lien de synchronisation directe
              </label>
              <p className="text-xs text-slate-500">
                Ouvrez simplement ce lien dans le navigateur de votre autre appareil pour fusionner instantanément vos {favoriteIds.length} favoris :
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getSyncLink()}
                  className={`flex-1 text-xs font-mono px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-[#081226] border-[#12305F] text-slate-300' : 'bg-[#F8F5EC] border-[#E2D9C8] text-slate-700'
                  }`}
                />
                <button
                  onClick={handleCopySyncLink}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#D4AF37] text-[#0B1B3A] font-semibold text-xs hover:bg-[#e4be42] transition cursor-pointer shrink-0 shadow-xs"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copié !' : 'Copier le lien'}</span>
                </button>
              </div>
            </div>

            {/* Option 2: Enter sync code */}
            <div className="space-y-2 border-t pt-4 border-slate-700/20">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Option 2 : Importer un code ou liste d'identifiants
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Collez ici un code ou une liste d'outils (ex: chatgpt, claude, mistral)"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className={`flex-1 text-xs px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-[#081226] border-[#12305F] text-[#F8F5EC]' : 'bg-[#F8F5EC] border-[#E2D9C8] text-[#0B1B3A]'
                  }`}
                />
                <button
                  onClick={handleManualImportCode}
                  disabled={!manualCode.trim()}
                  className="px-3.5 py-2 rounded-lg bg-[#D4AF37] text-[#0B1B3A] font-semibold text-xs hover:bg-[#e4be42] disabled:opacity-40 transition cursor-pointer shrink-0"
                >
                  Fusionner
                </button>
              </div>
            </div>

            {/* Option 3: JSON File Import/Export reminder */}
            <div className="space-y-2 border-t pt-4 border-slate-700/20 text-xs text-slate-500 flex items-center justify-between">
              <span>Besoin d'une sauvegarde complète sur disque ?</span>
              <button
                onClick={() => {
                  setShowSyncModal(false);
                  handleExportJSON();
                }}
                className="text-[#D4AF37] hover:underline font-semibold cursor-pointer"
              >
                Télécharger le fichier JSON →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content grid */}
      {favoriteTools.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border transition ${
          isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8] shadow-xs'
        }`}>
          <Bookmark className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-[#F8F5EC]' : 'text-[#0B1B3A]'}`}>
            Vous n'avez pas encore de favoris sur cet appareil
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Cliquez sur l'icône de marque-page sur n'importe quelle fiche outil pour constituer votre boîte à outils personnalisée, ou synchronisez vos favoris existants depuis un autre terminal.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={onSwitchToCatalog}
              className="px-5 py-2.5 text-xs font-semibold text-[#0B1B3A] bg-[#D4AF37] hover:bg-[#e4be42] rounded-lg transition cursor-pointer inline-flex items-center gap-2 shadow-xs"
            >
              <span>Explorer l'annuaire des 200 outils</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowSyncModal(true)}
              className={`px-4 py-2.5 text-xs font-semibold rounded-lg border transition cursor-pointer inline-flex items-center gap-2 ${
                isDark ? 'text-slate-300 border-[#12305F] hover:text-white' : 'text-slate-700 border-[#E2D9C8] hover:text-black'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Restaurer mes favoris d'un autre appareil</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Search in favorites */}
          <div className="max-w-md">
            <div className={`flex items-center rounded-lg px-3 py-2 text-xs border ${
              isDark ? 'bg-[#0B1B3A] border-[#12305F]' : 'bg-[#FFFFFF] border-[#E2D9C8] shadow-xs'
            }`}>
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filtrer dans mes favoris..."
                className={`w-full bg-transparent focus:outline-none ${
                  isDark ? 'text-[#F8F5EC] placeholder:text-slate-500' : 'text-[#0B1B3A] placeholder:text-slate-400'
                }`}
              />
              {filterQuery && (
                <button
                  onClick={() => setFilterQuery('')}
                  className="text-slate-400 hover:text-white dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isFavorite={true}
                isInComparator={comparatorIds.includes(tool.id)}
                onToggleFavorite={onToggleFavorite}
                onToggleComparator={onToggleComparator}
                onSelect={onSelectTool}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
