import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { CATALOGUE_OUTILS_IA } from './src/data/tools.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Prepare concise context of catalog tools for Gemini
const catalogueSummary = CATALOGUE_OUTILS_IA.map(t => ({
  id: t.id,
  nom: t.nom,
  categorie: t.categorie,
  modele_economique: t.modele_economique,
  prix_indicatif: t.prix_indicatif,
  support_francais: t.support_francais,
  description: t.description_courte,
  verifie: t.verifie
}));

// Route de recommandation de l'assistant Saviora IA
app.post('/api/recommend', async (req, res) => {
  const { message, categorie, budget, besoin_francais, conversation_history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Le paramètre message est obligatoire.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Mode local de secours côté serveur
    return res.json(getLocalRecommendation(message, categorie, budget, besoin_francais));
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const promptText = `L'utilisateur consulte l'annuaire Saviora IA et pose la question suivante :
"${message}"

Filtres contextuels :
- Catégorie souhaitée : ${categorie || 'Toutes catégories'}
- Préférence de budget : ${budget || 'Non spécifié'}
- Nécessité d'un support complet de la langue française : ${besoin_francais ? 'Oui impératif' : 'Non strict'}

Voici la liste des outils du catalogue officiel Saviora IA que tu peux recommander :
${JSON.stringify(catalogueSummary)}

Instructions :
1. Rédige une réponse bienveillante, fluide et structurée en français (2 à 3 paragraphes concis).
2. Explique pourquoi les outils recommandés sont adaptés au cas d'usage, en mentionnant leur modèle de prix et leur niveau de prise en charge du français.
3. À la fin de ta réponse, insère STRICTEMENT un bloc JSON de métadonnées au format exact suivant :
\`\`\`json
{
  "outils_recommandes": ["id_outil_1", "id_outil_2", "id_outil_3"]
}
\`\`\`
Utilise uniquement des IDs figurant dans la liste ci-dessus (maximum 4 outils).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
    });

    const responseText = response.text || '';

    // Extract tool IDs from JSON block if present
    let toolIds: string[] = [];
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    let cleanedResponse = responseText;

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsed.outils_recommandes)) {
          toolIds = parsed.outils_recommandes.filter((id: string) =>
            CATALOGUE_OUTILS_IA.some(t => t.id === id)
          );
        }
        cleanedResponse = responseText.replace(/```json[\s\S]*?```/, '').trim();
      } catch (e) {
        // Fallback parsing
      }
    }

    // If no tool IDs extracted, find matching names in response
    if (toolIds.length === 0) {
      const lower = responseText.toLowerCase();
      for (const t of CATALOGUE_OUTILS_IA) {
        if (lower.includes(t.nom.toLowerCase()) && !toolIds.includes(t.id)) {
          toolIds.push(t.id);
          if (toolIds.length >= 3) break;
        }
      }
    }

    return res.json({
      reponse: cleanedResponse,
      outils_recommandes: toolIds.slice(0, 4),
      mode: 'gemini-serveur'
    });
  } catch (error: any) {
    console.error('Erreur Gemini API:', error);
    // Bascule automatique et transparente vers le mode local de secours
    return res.json(getLocalRecommendation(message, categorie, budget, besoin_francais));
  }
});

// Algorithme du mode local de secours
function getLocalRecommendation(message: string, cat?: string, budget?: string, frNeeded?: boolean) {
  const query = message.toLowerCase();
  
  let candidates = [...CATALOGUE_OUTILS_IA];

  if (cat && cat !== 'Toutes') {
    candidates = candidates.filter(t => t.categorie === cat);
  }

  if (frNeeded) {
    candidates = candidates.filter(t => t.support_francais === 'Complet');
  }

  if (budget) {
    const b = budget.toLowerCase();
    if (b === 'gratuit' || b === 'free') {
      candidates = candidates.filter(t => t.modele_economique === 'Gratuit' || t.modele_economique === 'Open Source');
    } else if (b === 'open-source') {
      candidates = candidates.filter(t => t.modele_economique === 'Open Source');
    } else if (b === 'modere') {
      candidates = candidates.filter(t => t.modele_economique === 'Freemium' || t.modele_economique === 'Gratuit');
    }
  }

  // Score relevance by keyword match in name, description, tags, use cases
  const scored = candidates.map(tool => {
    let score = 0;
    const nameLower = tool.nom.toLowerCase();
    const descLower = tool.description_detaillee.toLowerCase();
    const tagMatch = tool.tags.some(tag => query.includes(tag.toLowerCase()));
    const usageMatch = tool.cas_usage.some(u => query.includes(u.toLowerCase()));

    if (query.includes(nameLower)) score += 50;
    if (tagMatch) score += 20;
    if (usageMatch) score += 15;
    if (descLower.includes(query)) score += 10;
    
    // Check words
    const words = query.split(/\s+/).filter(w => w.length > 3);
    for (const w of words) {
      if (descLower.includes(w)) score += 4;
      if (tool.tags.some(t => t.toLowerCase().includes(w))) score += 6;
      if (tool.cas_usage.some(c => c.toLowerCase().includes(w))) score += 5;
    }

    // Boost verified and high rating
    if (tool.verifie) score += 8;
    score += tool.note_globale * 2;

    return { tool, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 3).map(s => s.tool);

  let responseText = `Voici notre sélection personnalisée issue de l'analyse Saviora IA :`;
  if (top.length > 0) {
    responseText += `\n\nNous vous recommandons tout particulièrement **${top[0].nom}** (${top[0].modele_economique}, ${top[0].prix_indicatif}), qui répond idéalement à votre recherche.`;
    if (top[1]) {
      responseText += ` En complément ou comme alternative directe, **${top[1].nom}** offre d'excellentes fonctionnalités avec une note globale de ${top[1].note_globale}/5.`;
    }
    if (top[2]) {
      responseText += ` Vous pouvez également examiner **${top[2].nom}** (${top[2].support_francais === 'Complet' ? 'support français intégral' : 'support multilingue'}).`;
    }
    responseText += `\n\nN'hésitez pas à cliquer sur chaque fiche pour comparer les tarifs, cas d'usage et forces/limites détaillés !`;
  } else {
    responseText = `Aucun outil n'a correspondu strictement à tous vos critères combinés. Nous vous suggérons d'élargir la sélection de budget ou de catégorie.`;
  }

  return {
    reponse: responseText,
    outils_recommandes: top.map(t => t.id),
    mode: 'local-secours'
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur Saviora IA démarré avec succès sur http://localhost:${PORT}`);
  });
}

startServer();
