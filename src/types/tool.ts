export type EconomicModel = 'Gratuit' | 'Freemium' | 'Essai gratuit' | 'Payant' | 'Open Source';

export type FrenchSupport = 'Complet' | 'Partiel' | 'Anglais uniquement';

export interface Tool {
  id: string;
  nom: string;
  categorie: string;
  modele_economique: EconomicModel;
  prix_indicatif: string;
  description_courte: string;
  description_detaillee: string;
  cas_usage: string[];
  points_forts: string[];
  limites: string[];
  support_francais: FrenchSupport;
  url_officielle: string;
  verifie: boolean;
  derniere_verification: string | null;
  note_globale: number;
  popularite: number;
  tags: string[];
  alternatives: string[];
}

export interface AssistantRecommendationRequest {
  message: string;
  categorie?: string;
  budget?: string;
  besoin_francais?: boolean;
}

export interface AssistantRecommendationResponse {
  reponse: string;
  outils_recommandes: string[]; // Tool IDs
  mode: 'gemini-serveur' | 'local-secours';
}
