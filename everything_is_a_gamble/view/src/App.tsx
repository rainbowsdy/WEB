import { useEffect, useState } from 'react';
import { Dice1, Bike } from 'lucide-react';
import { BetCard } from './components/BetCard';
import { Header } from './components/Header';
import { Utilisateur, MoyenneVelos, getMoyennes } from './api';

export default function App() {
  const [moyennes, setMoyennes] = useState<MoyenneVelos[]>([]);
  const [utilisateur, setUtilisateur] = useState<Utilisateur>({ username: "", money: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMoyennes();
        setMoyennes(data || []);
      } catch (error) {
        console.error("Erreur lors du fetch :", error);
        setError(error instanceof Error ? error.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const bets = moyennes
    .filter(station => station.nom && station.num_station && station.moyenne_velos !== undefined)
    .map((station) => ({
      id: station.num_station!,
      title: `VeloV: ${station.nom}`,
      description: "Il y a t-il plus ou moins de Velov actuellement?",
      icon: Bike,
      category: "Transport",
      currentValue: `${station.moyenne_velos} vélos`,
      odds: {
        Plus: 2.0,
        Moins: 2.0,
        Exactement: 5.0
      }
    }));

  const handleBetPlaced = (newMoney: number) => {
    setUtilisateur({ ...utilisateur, money: newMoney });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header utilisateur={utilisateur} setUtilisateur={setUtilisateur} />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-6 py-2 mb-6">
            <Dice1 className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400">Projet École</span>
          </div>

          <h1 className="text-6xl mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Velo'v Gamble
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Pariez sur l'imprévisible : Les Vélo'vs de Lyon
          </p>
        </div>

        {/* Bets Grid */}
        {loading ? (
          <div className="text-center text-white">
            <p className="text-xl">Chargement des moyennes...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p className="text-xl">Erreur : {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bets.map((bet) => (
              <BetCard
                key={bet.id}
                bet={bet}
                utilisateur={utilisateur}
                onBetPlaced={handleBetPlaced}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
