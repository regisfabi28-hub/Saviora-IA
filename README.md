# Saviora IA – projet Flutter

**Saviora IA** est un annuaire intelligent des meilleurs outils d'intelligence artificielle et logiciels, en français, avec un assistant qui recommande l'outil adapté au besoin et au budget.

Version 0.1 (squelette) : accueil avec recherche et catégories, fiche outil, favoris (stockés sur l'appareil), assistant de recommandation (serveur ou mode local de secours), réglages (méthode, confidentialité, conditions, contact, effacement des données). Catalogue de départ : 200 outils, tous à vérifier avant publication.

> **Important** : ce squelette a été écrit sans pouvoir être compilé dans l'environnement de rédaction. Les versions des paquets (`pubspec.yaml`) peuvent demander un petit ajustement. Lancez `flutter pub upgrade`, puis `flutter analyze`, et corrigez les éventuels avertissements avant d'aller plus loin.

## 1. Installation

1. Installer Flutter : https://docs.flutter.dev/get-started/install, puis lancer `flutter doctor`.
2. Copier ce dossier sur votre ordinateur et, dans ce dossier :

```
flutter create --org com.votrenom --project-name saviora_ia --platforms=android,ios .
flutter pub get
dart run flutter_launcher_icons
flutter analyze
flutter test
flutter run
```

- `flutter create .` ajoute les dossiers `android/` et `ios/` sans écraser les fichiers existants (gardez tout de même une copie de sauvegarde).
- Remplacez `com.votrenom` par l'identifiant de votre structure. L'identifiant final de l'application sera `com.votrenom.saviora_ia` ; il ne pourra plus être changé après publication.
- `dart run flutter_launcher_icons` génère les icônes Android et iOS à partir des fichiers de `assets/branding/`.

## 2. Réglages à personnaliser (`lib/core/config.dart`)

| Réglage | Rôle |
|---|---|
| `appName` | Nom affiché : « Saviora IA ». Vérifier sa disponibilité (stores, domaine, marque). |
| `supportEmail` | Adresse de contact et de signalement (obligatoire pour les stores). |
| `privacyUrl`, `termsUrl` | Pages légales hébergées en ligne (obligatoires pour les stores). |
| `assistantUrl` | Adresse du serveur de l'assistant. Vide = mode local de secours. |

Exemple avec un serveur : `flutter run --dart-define=ASSISTANT_URL=https://votre-serveur/assistant`

Les valeurs `exemple.com` sont des espaces réservés : remplacez-les avant toute soumission.

## 3. Identité visuelle

- Fichiers d'icône : `assets/branding/` (icône 1024 pour iOS, premier plan et monochrome pour Android adaptatif).
- Charte complète (couleurs, typographie, règles d'usage) : `docs/CHARTE_GRAPHIQUE.md`.
- Couleurs dans le code : `lib/core/brand_colors.dart` ; thème : `lib/core/theme.dart`.
- Palette : bleu nuit #0B1B3A, bleu profond #12305F, or #D4AF37, ivoire #F8F5EC. Police recommandée : Poppins.

## 4. Catalogue

Fichier : `assets/data/catalogue_outils_ia.json`. Chaque fiche porte `verifie: false`. Une fois la fiche contrôlée, passez-la à `true` et renseignez `derniere_verification` (format AAAA-MM-JJ). Avant le lancement public, ne publiez que les fiches vérifiées (filtre à ajouter dans `catalog_repository.dart`). Méthode de vérification : `docs/METHODE_EVALUATION.md`.

## 5. Structure

```
lib/
  main.dart, app.dart, router.dart
  core/       config, thème, couleurs de marque, utilitaires, ouverture de liens
  data/       modèle Tool, lecture du catalogue
  services/   assistant (serveur + mode local)
  widgets/    carte d'outil, barre de navigation
  screens/    accueil, fiche, assistant, favoris, réglages
assets/
  data/       catalogue des outils (JSON)
  branding/   icônes de l'application
docs/         charte graphique, conformité des stores, serveur de l'assistant,
              méthode d'évaluation, modèle de politique de confidentialité
test/         tests du moteur de recherche et de l'assistant local
```

## 6. Documentation

| Document | Contenu |
|---|---|
| `docs/CHARTE_GRAPHIQUE.md` | Logo, couleurs, typographie, fichiers d'icône par store |
| `docs/CONFORMITE_STORES.md` | Liste de contrôle Google Play et App Store |
| `docs/BACKEND_ASSISTANT.md` | Contrat d'échange et règles du serveur de l'assistant |
| `docs/METHODE_EVALUATION.md` | Méthode publique de vérification des fiches |
| `docs/POLITIQUE_CONFIDENTIALITE_MODELE.md` | Modèle à faire relire par un juriste |

## 7. Prochaines étapes techniques

1. Remplacer les espaces réservés de `config.dart` et héberger les pages légales.
2. Vérifier les 50 premières fiches du catalogue et ajouter le filtre « fiches vérifiées uniquement ».
3. Ajouter le comparateur (2 à 3 outils côte à côte).
4. Mettre en place le serveur de l'assistant (`docs/BACKEND_ASSISTANT.md`).
5. Créer le keystore Android et générer le .aab : `flutter build appbundle --release`.
6. Compiler pour iOS sur un Mac : `flutter build ipa --release`.
7. Suivre `docs/CONFORMITE_STORES.md` avant chaque soumission.
