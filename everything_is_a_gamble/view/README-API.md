# 🚀 Guide d'utilisation de l'API typée

Ce projet utilise **openapi-typescript** et **openapi-fetch** pour générer automatiquement un client API TypeScript avec une sécurité de type complète.

## 📋 Table des matières

- [Installation](#installation)
- [Génération des types](#génération-des-types)
- [Utilisation du client API](#utilisation-du-client-api)
- [Exemples pratiques](#exemples-pratiques)
- [Configuration](#configuration)
- [Avantages](#avantages)

## 🔧 Installation

Les dépendances sont déjà installées dans le projet :

```bash
# Dépendances de production
npm install openapi-fetch

# Dépendances de développement
npm install --save-dev openapi-typescript
```

## 🔄 Génération des types

### Génération automatique

Utilisez le script npm pour régénérer les types à partir du fichier [`api.yaml`](api.yaml:1):

```bash
npm run generate:api
```

Cette commande exécute :

```bash
openapi-typescript api.yaml -o src/types/api.ts
```

### Quand régénérer les types ?

- ✅ Après modification du fichier [`api.yaml`](api.yaml:1)
- ✅ Après ajout de nouveaux endpoints
- ✅ Après modification des schémas de données
- ✅ Avant de commencer à coder de nouvelles fonctionnalités

## 💻 Utilisation du client API

### Import du client

```typescript
import { apiClient } from './api/client';
// ou
import { login, register, getTotalVelos } from './api/client';
```

### Méthode 1 : Utilisation directe du client

```typescript
import { apiClient } from './api/client';

// POST avec body
const { data, error } = await apiClient.POST('/login', {
  body: {
    username: 'john_doe',
    password: 'password123'
  }
});

// GET simple
const { data, error } = await apiClient.GET('/nb_total');

// GET avec paramètres de requête
const { data, error } = await apiClient.GET('/nb_normal', {
  params: {
    query: { num_station: 1234 }
  }
});

// GET avec paramètres de chemin
const { data, error } = await apiClient.GET('/stations/{id}/{type}', {
  params: {
    path: { id: 1234, type: 'total' }
  }
});
```

### Méthode 2 : Utilisation des fonctions helper

Le fichier [`src/api/client.ts`](src/api/client.ts:1) fournit des fonctions helper pour simplifier l'utilisation :

```typescript
import { login, register, getTotalVelos, getStationHistory } from './api/client';

// Authentification
try {
  const userData = await login('john_doe', 'password123');
  console.log(`Solde: ${userData?.money}€`);
} catch (error) {
  console.error('Erreur de connexion:', error);
}

// Récupération de données
const stations = await getTotalVelos();
const history = await getStationHistory(1234, 'total');
```

## 📚 Exemples pratiques

### Exemple 1 : Authentification complète

```typescript
import { register, login, updateMoney } from './api/client';

async function authenticateUser() {
  try {
    // Inscription
    const newUser = await register('alice', 'secure_password');
    console.log('Utilisateur créé:', newUser?.user_id);

    // Connexion
    const userData = await login('alice', 'secure_password');
    console.log('Connecté:', userData?.username, 'Solde:', userData?.money);

    // Mise à jour du solde
    if (userData?.username) {
      const updated = await updateMoney(userData.username, 950);
      console.log('Nouveau solde:', updated?.money);
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

### Exemple 2 : Récupération des données vélos

```typescript
import { getTotalVelos, getVelosElec, getVelosNormal } from './api/client';

async function fetchVelosData() {
  try {
    // Récupération parallèle
    const [total, elec, normal] = await Promise.all([
      getTotalVelos(),
      getVelosElec(),
      getVelosNormal()
    ]);

    console.log('Stations avec le plus de vélos:');
    total?.slice(0, 5).forEach(station => {
      console.log(`${station.nom}: ${station.total_velos} vélos`);
    });

    console.log('\nStations avec vélos électriques:');
    elec?.slice(0, 5).forEach(station => {
      console.log(`${station.nom}: ${station.velo_elec} vélos élec.`);
    });
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

### Exemple 3 : Historique d'une station

```typescript
import { getStationHistory } from './api/client';

async function displayStationHistory(stationId: number) {
  try {
    const history = await getStationHistory(stationId, 'total');
    
    console.log(`Station: ${history?.nom} (#${history?.num_station})`);
    console.log(`Nombre d'entrées: ${history?.historique?.length}`);
    
    history?.historique?.slice(0, 10).forEach(entry => {
      const date = new Date(entry.horodatage).toLocaleString();
      console.log(`${date}: ${entry.velo_total} vélos`);
    });
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

### Exemple 4 : Utilisation dans un composant React

```typescript
import React, { useEffect, useState } from 'react';
import { getTotalVelos } from './api/client';

export const VelosDisplay: React.FC = () => {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTotalVelos();
        setStations(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h2>Stations Velov</h2>
      <ul>
        {stations.map((station, idx) => (
          <li key={idx}>
            {station.nom}: {station.total_velos} vélos
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:3001
```

Pour la production :

```env
VITE_API_URL=https://inculcative-shenita-watchfully.ngrok-free.dev
```

### Modification de l'URL de base

Le client API utilise automatiquement la variable d'environnement. Pour la modifier manuellement, éditez [`src/api/client.ts`](src/api/client.ts:5):

```typescript
const API_BASE_URL = 'http://localhost:3001'; // URL personnalisée
```

## ✨ Avantages

### 1. Type-Safety complet

```typescript
// ✅ TypeScript détecte les erreurs à la compilation
const { data } = await apiClient.POST('/login', {
  body: {
    username: 'john',
    password: 'pass',
    // email: 'test@test.com' // ❌ Erreur : propriété non autorisée
  }
});

// ✅ Autocomplétion pour les réponses
console.log(data?.username); // Autocomplétion disponible
console.log(data?.money);    // Autocomplétion disponible
```

### 2. Autocomplétion intelligente

- 🎯 Autocomplétion des endpoints
- 🎯 Autocomplétion des paramètres de requête
- 🎯 Autocomplétion des propriétés de réponse
- 🎯 Suggestions de types dans VSCode

### 3. Refactoring sûr

Si vous modifiez [`api.yaml`](api.yaml:1) et régénérez les types, TypeScript vous alertera automatiquement sur tous les endroits du code qui doivent être mis à jour.

### 4. Documentation intégrée

Les types générés incluent les descriptions de l'OpenAPI :

```typescript
// Hover sur la fonction pour voir la documentation
await getStationHistory(1234, 'total');
// 📝 Affiche : "Retourne l'historique des données pour une station spécifique"
```

### 5. Validation au moment de la compilation

```typescript
// ❌ Erreur TypeScript : type invalide
await getStationHistory(1234, 'invalid'); // 'invalid' n'est pas dans 'normal' | 'elec' | 'total'

// ✅ Correct
await getStationHistory(1234, 'total');
```

## 🔍 Fichiers générés

- [`src/types/api.ts`](src/types/api.ts:1) - Types TypeScript générés depuis [`api.yaml`](api.yaml:1)
- [`src/api/client.ts`](src/api/client.ts:1) - Client API avec fonctions helper
- [`src/vite-env.d.ts`](src/vite-env.d.ts:1) - Déclarations TypeScript pour Vite
- [`src/examples/ApiUsageExamples.tsx`](src/examples/ApiUsageExamples.tsx:1) - Exemples d'utilisation complets

## 📖 Ressources

- [Documentation openapi-typescript](https://openapi-ts.pages.dev/)
- [Documentation openapi-fetch](https://openapi-ts.pages.dev/openapi-fetch/)
- [Spécification OpenAPI 3.0](https://swagger.io/specification/)

## 🆘 Dépannage

### Erreur : "Cannot find module './types/api'"

Régénérez les types :

```bash
npm run generate:api
```

### Erreur : "Property 'env' does not exist on type 'ImportMeta'"

Assurez-vous que [`src/vite-env.d.ts`](src/vite-env.d.ts:1) existe et est correctement configuré.

### Les types ne correspondent pas à l'API

1. Vérifiez que [`api.yaml`](api.yaml:1) est à jour
2. Régénérez les types : `npm run generate:api`
3. Redémarrez le serveur de développement

---

**Bon développement ! 🚀**
