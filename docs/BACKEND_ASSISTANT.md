# Contrat d'Échange et Architecture Serveur Assistant – Saviora IA

## 1. Principes de Fonctionnement
L'assistant Saviora IA repose sur une architecture résiliente à double niveau :
1. **Mode Serveur IA (Gemini 3.8 Flash)** : pour une analyse sémantique approfondie du besoin, du secteur d'activité, du niveau technique et du budget exprimé par l'utilisateur.
2. **Mode Local de Secours (Algorithme autonome)** : intégré directement côté client, filtrant instantanément le catalogue sans latence réseau et sans dépendance externe.

## 2. Spécification de l'API Recommandation (`/api/recommend`)
- **Méthode** : `POST`
- **En-têtes** : `Content-Type: application/json`
- **Corps de la requête** :
```json
{
  "message": "Je cherche un outil pour générer des vidéos marketing en français avec un budget de moins de 30€/mois",
  "categorie": "Vidéo & Animation",
  "budget": "modere",
  "besoin_francais": true,
  "conversation_history": []
}
```
- **Corps de la réponse attendue** :
```json
{
  "reponse": "Pour concevoir des vidéos promotionnelles avec support français sous la barre des 30 €/mois, je vous recommande particulièrement HeyGen et CapCut AI...",
  "outils_recommandes": ["heygen", "capcut-ai", "invideo-ai"],
  "mode": "gemini-serveur"
}
```
