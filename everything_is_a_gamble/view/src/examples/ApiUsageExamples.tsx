import React, { useEffect, useState } from 'react';
import {
  login,
  register,
  getTotalVelos,
  getVelosElec,
  getStationHistory,
  updateMoney,
} from '../api';

/**
 * Exemples d'utilisation du client API typé
 * 
 * Ce fichier démontre comment utiliser les fonctions API générées
 * avec une sécurité de type complète.
 */

// ============================================
// Exemple 1: Authentification
// ============================================
export const AuthExample: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<{ username: string; money: number } | null>(null);
  const [error, setError] = useState<string>('');

  const handleRegister = async () => {
    try {
      const data = await register(username, password);
      console.log('Utilisateur créé:', data);
      alert(`Compte créé avec succès! ID: ${data?.user_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
    }
  };

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      if (data && data.username && data.money !== undefined) {
        setUser({ username: data.username, money: data.money });
        setError('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la connexion');
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Exemple: Authentification</h2>
      
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mr-2"
      />
      
      <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2 mr-2">
        S'inscrire
      </button>
      <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2">
        Se connecter
      </button>

      {user && (
        <div className="mt-4 p-2 bg-green-100">
          Connecté: {user.username} - Solde: {user.money}€
        </div>
      )}
      {error && <div className="mt-4 p-2 bg-red-100">{error}</div>}
    </div>
  );
};

// ============================================
// Exemple 2: Récupération des données vélos
// ============================================
export const VelosDataExample: React.FC = () => {
  const [totalVelos, setTotalVelos] = useState<any[]>([]);
  const [velosElec, setVelosElec] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVelosData = async () => {
    setLoading(true);
    try {
      // Récupération avec type-safety complet
      const [total, elec] = await Promise.all([
        getTotalVelos(),
        getVelosElec(),
      ]);

      setTotalVelos(total || []);
      setVelosElec(elec || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVelosData();
  }, []);

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Exemple: Données Vélos</h2>
      
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold">Total Vélos (Top 5)</h3>
            <ul>
              {totalVelos.slice(0, 5).map((station, idx) => (
                <li key={idx}>
                  {station.nom}: {station.total_velos} vélos
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold">Vélos Électriques (Top 5)</h3>
            <ul>
              {velosElec.slice(0, 5).map((station, idx) => (
                <li key={idx}>
                  {station.nom}: {station.velo_elec} vélos élec.
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <button 
        onClick={fetchVelosData} 
        className="mt-4 bg-blue-500 text-white px-4 py-2"
      >
        Rafraîchir
      </button>
    </div>
  );
};

// ============================================
// Exemple 3: Historique d'une station
// ============================================
export const StationHistoryExample: React.FC = () => {
  const [stationId, setStationId] = useState<number>(1234);
  const [historyType, setHistoryType] = useState<'normal' | 'elec' | 'total'>('total');
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getStationHistory(stationId, historyType);
      setHistory(data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Exemple: Historique Station</h2>
      
      <div className="mb-4">
        <input
          type="number"
          placeholder="ID Station"
          value={stationId}
          onChange={(e) => setStationId(Number(e.target.value))}
          className="border p-2 mr-2"
        />
        
        <select 
          value={historyType} 
          onChange={(e) => setHistoryType(e.target.value as any)}
          className="border p-2 mr-2"
        >
          <option value="total">Total</option>
          <option value="elec">Électrique</option>
          <option value="normal">Normal</option>
        </select>
        
        <button onClick={fetchHistory} className="bg-blue-500 text-white px-4 py-2">
          Charger l'historique
        </button>
      </div>

      {loading && <p>Chargement...</p>}
      
      {history && (
        <div>
          <h3 className="font-bold">{history.nom} (#{history.num_station})</h3>
          <p className="text-sm text-gray-600">
            {history.historique?.length || 0} entrées d'historique
          </p>
          <div className="mt-2 max-h-40 overflow-y-auto">
            {history.historique?.slice(0, 10).map((entry: any, idx: number) => (
              <div key={idx} className="text-sm border-b py-1">
                {new Date(entry.horodatage).toLocaleString()} - 
                {entry.velo_total !== undefined && ` Total: ${entry.velo_total}`}
                {entry.velo_elec !== undefined && ` Élec: ${entry.velo_elec}`}
                {entry.velo_normal !== undefined && ` Normal: ${entry.velo_normal}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// Exemple 4: Mise à jour du solde
// ============================================
export const UpdateMoneyExample: React.FC = () => {
  const [username, setUsername] = useState('john_doe');
  const [newMoney, setNewMoney] = useState<number>(1000);
  const [result, setResult] = useState<string>('');

  const handleUpdateMoney = async () => {
    try {
      const data = await updateMoney(username, newMoney);
      setResult(`Solde mis à jour: ${data?.money}€`);
    } catch (err) {
      setResult(`Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Exemple: Mise à jour du solde</h2>
      
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="number"
        placeholder="Nouveau solde"
        value={newMoney}
        onChange={(e) => setNewMoney(Number(e.target.value))}
        className="border p-2 mr-2"
      />
      
      <button onClick={handleUpdateMoney} className="bg-blue-500 text-white px-4 py-2">
        Mettre à jour
      </button>

      {result && <div className="mt-4 p-2 bg-gray-100">{result}</div>}
    </div>
  );
};

// ============================================
// Composant principal avec tous les exemples
// ============================================
export const ApiExamplesDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">
        Exemples d'utilisation de l'API typée
      </h1>
      
      <AuthExample />
      <VelosDataExample />
      <StationHistoryExample />
      <UpdateMoneyExample />
      
      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h3 className="font-bold mb-2">💡 Avantages du client typé:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Autocomplétion complète dans VSCode</li>
          <li>Détection des erreurs à la compilation</li>
          <li>Types précis pour les requêtes et réponses</li>
          <li>Refactoring sûr et facile</li>
          <li>Documentation intégrée via les types</li>
        </ul>
      </div>
    </div>
  );
};
