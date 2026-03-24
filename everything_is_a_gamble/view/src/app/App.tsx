import { useState } from 'react';
import { Dice1, Bike, Cloud, TrendingUp, Users, Zap } from 'lucide-react';
import { BetCard } from './components/BetCard';
import { Header } from './components/Header';

export default function App() {
  const [balance] = useState(1000);

  const bets = [
    {
      id: 1,
      title: "VeloV Lyon",
      description: "Combien de vélos seront disponibles à la station Bellecour dans 1h ?",
      icon: Bike,
      category: "Transport",
      currentValue: "12 vélos",
      odds: {
        over15: 2.5,
        under10: 1.8,
        exact12: 5.0
      }
    },
    {
      id: 2,
      title: "Météo Lyon",
      description: "Quelle sera la température à 18h aujourd'hui ?",
      icon: Cloud,
      category: "Météo",
      currentValue: "15°C actuellement",
      odds: {
        over20: 3.2,
        between15_20: 2.0,
        under15: 2.5
      }
    },
    {
      id: 3,
      title: "Crypto Volatilité",
      description: "Le Bitcoin va-t-il monter ou descendre dans la prochaine heure ?",
      icon: TrendingUp,
      category: "Finance",
      currentValue: "42,350$",
      odds: {
        up: 1.9,
        down: 1.9,
        stable: 4.5
      }
    },
    {
      id: 4,
      title: "Trafic Reddit",
      description: "Combien de posts sur r/france dans les 30 prochaines minutes ?",
      icon: Users,
      category: "Social",
      currentValue: "~8 posts/30min",
      odds: {
        over10: 2.8,
        between5_10: 1.7,
        under5: 3.5
      }
    },
    {
      id: 5,
      title: "API Random",
      description: "Le prochain nombre aléatoire (1-100) sera-t-il pair ou impair ?",
      icon: Dice1,
      category: "Aléatoire",
      currentValue: "Généré toutes les 5min",
      odds: {
        even: 2.0,
        odd: 2.0,
        over50: 1.95
      }
    },
    {
      id: 6,
      title: "Consommation Électrique",
      description: "Pic de consommation en France dans les 2 prochaines heures ?",
      icon: Zap,
      category: "Énergie",
      currentValue: "68,500 MW",
      odds: {
        over70k: 2.3,
        under65k: 3.1,
        stable: 2.0
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header balance={balance} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-6 py-2 mb-6">
            <Dice1 className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400">Projet École - Paris Loufoques</span>
          </div>

          <h1 className="text-6xl mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Everything is a Gamble
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Pariez sur l'imprévisible : vélos, météo, crypto, et bien plus encore !
          </p>
        </div>

        {/* Bets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bets.map((bet) => (
            <BetCard key={bet.id} bet={bet} />
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl mb-4 text-white">Bientôt disponible</h2>
            <div className="grid grid-cols-2 gap-4 text-white/70">
              <div>🚇 Affluence métro TCL</div>
              <div>📈 Cours actions CAC40</div>
              <div>🌊 Niveau de la Saône</div>
              <div>✈️ Retards vols aéroport</div>
              <div>🎬 Box office cinéma</div>
              <div>⚽ Stats matchs en direct</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}