# Velo'v Gamble - Projet École

Application de paris sur les stations Vélo'v de Lyon.

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build
```

L'application sera accessible sur `http://localhost:3001`

## 📁 Structure du projet

```
view/
├── public/              # Fichiers statiques
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── api/             # Client API typé
│   │   └── client.ts         # Client HTTP avec fonctions helper
│   ├── components/      # Composants React réutilisables
│   │   ├── AuthPage.tsx      # Page de connexion/inscription
│   │   ├── BetCard.tsx       # Carte de pari
│   │   └── Header.tsx        # En-tête de l'application
│   ├── examples/        # Exemples d'utilisation
│   │   └── ApiUsageExamples.tsx  # Exemples du client API
│   ├── types/           # Types TypeScript
│   │   ├── api.ts            # Types générés depuis api.yaml
│   │   └── user.ts           # Type Utilisateur partagé
│   ├── App.tsx          # Composant principal
│   ├── index.tsx        # Point d'entrée de l'application
│   ├── index.css        # Styles globaux (Tailwind CSS)
│   └── vite-env.d.ts    # Déclarations TypeScript pour Vite
├── api.yaml             # Spécification OpenAPI de l'API
├── index.html           # Template HTML
├── package.json         # Dépendances et scripts
├── tailwind.config.js   # Configuration Tailwind CSS
├── postcss.config.js    # Configuration PostCSS
├── tsconfig.json        # Configuration TypeScript
├── vite.config.ts       # Configuration Vite
├── README.md            # Ce fichier
└── README-API.md        # Documentation du client API
```

## 🛠️ Technologies utilisées

- **React 19** - Bibliothèque UI
- **TypeScript 5** - Typage statique
- **Vite 8** - Build tool et dev server
- **Tailwind CSS v4** - Framework CSS
- **Lucide React** - Icônes
- **openapi-typescript** - Génération de types depuis OpenAPI
- **openapi-fetch** - Client HTTP typé

## 📝 Composants principaux

### App.tsx

Composant principal qui :

- Récupère les données des stations Vélo'v
- Gère l'état de l'utilisateur
- Affiche la grille de paris

### components/BetCard.tsx

Carte de pari qui permet de :

- Afficher les informations d'une station
- Sélectionner un type de pari (Plus/Moins/Exactement)
- Saisir un montant
- Placer un pari

### components/Header.tsx

En-tête qui affiche :

- Le logo et le titre
- Le solde de l'utilisateur (si connecté)
- Le bouton de connexion (si non connecté)
- Menu déroulant avec option de déconnexion (si connecté)

### components/AuthPage.tsx

Page d'authentification pour :

- Se connecter
- Créer un compte

## 🎨 Styles

Le projet utilise **Tailwind CSS v4** avec :

- Variables CSS personnalisées pour les couleurs
- Support du mode sombre
- Classes utilitaires pour un développement rapide

## 🔗 API

L'application utilise un **client API typé** généré automatiquement depuis la spécification OpenAPI ([`api.yaml`](api.yaml)).

### Fonctionnalités de l'API

- Authentification utilisateur (register/login)
- Gestion du solde utilisateur
- Données vélos Velov Lyon (total, électriques, normaux)
- Informations statiques des stations
- Historique des données par station

### URLs disponibles

- **Développement** : `http://localhost:3001`
- **Production** : `https://inculcative-shenita-watchfully.ngrok-free.dev`

### Utilisation du client API

```typescript
import { login, getTotalVelos, getStationHistory } from './api/client';

// Authentification
const user = await login('username', 'password');

// Récupération des données
const stations = await getTotalVelos();
const history = await getStationHistory(1234, 'total');
```

📖 **Documentation complète** : Voir [`README-API.md`](README-API.md)

## 📚 Scripts disponibles

### Développement

- `npm run dev` - Lance le serveur de développement (port 3000)
- `npm run preview` - Prévisualise la version de production

### Build

- `npm run build` - Construit l'application pour la production (TypeScript + Vite)

### Génération

- `npm run generate:api` - Régénère les types TypeScript depuis api.yaml

### Nettoyage

- `npm run clean` - Supprime les fichiers de build et le cache Vite
- `npm run clobber` - Nettoyage complet (build, cache, node_modules, package-lock.json)
  
  ⚠️ **Attention** : `npm run clobber` nécessite de réinstaller les dépendances avec `npm install` après utilisation

## 👨‍💻 Développement

### Ajouter un nouveau composant

1. Créer un fichier dans `src/components/`
2. Exporter le composant
3. L'importer dans `App.tsx` ou un autre composant

### Modifier les styles

1. Éditer `src/index.css` pour les styles globaux
2. Utiliser les classes Tailwind directement dans les composants

### Bonnes pratiques

- **Types partagés** : Utiliser `src/types/` pour les types réutilisables
- **DRY** : Éviter la duplication de code en créant des fonctions helper
- **Accessibilité** : Ajouter des attributs ARIA appropriés
- **Validation** : Valider les entrées utilisateur côté client

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:3001
```

**Note** : Les variables d'environnement Vite doivent commencer par `VITE_`

## 📄 Licence

Projet école - Tous droits réservés
