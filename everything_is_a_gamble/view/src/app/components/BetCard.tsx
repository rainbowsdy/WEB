import { useState } from 'react';
import { LucideIcon, TrendingUp, Clock, Tag } from 'lucide-react';

interface BetCardProps {
  bet: {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
    category: string;
    currentValue: string;
    odds: Record<string, number | undefined>;
  };
}

export function BetCard({ bet }: BetCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');

  const Icon = bet.icon;

  const handlePlaceBet = () => {
    if (selectedOption && amount) {
      alert(`Paris placé !\n${selectedOption}: ${amount}€\nCote: ${bet.odds[selectedOption]}x`);
      setSelectedOption(null);
      setAmount('');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all hover:scale-[1.02] hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white">{bet.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Tag className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-purple-400">{bet.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-white/70 text-sm mb-4">{bet.description}</p>

      {/* Current Value */}
      <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-2 mb-4">
        <TrendingUp className="w-4 h-4 text-blue-400" />
        <span className="text-sm text-blue-300">{bet.currentValue}</span>
      </div>

      {/* Odds Options */}
      <div className="space-y-2 mb-4">
        {Object.entries(bet.odds).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setSelectedOption(key)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${selectedOption === key
              ? 'bg-yellow-400/30 border-2 border-yellow-400'
              : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
          >
            <span className="text-white text-sm capitalize">
              {key.replace('_', ' ').replace(/([A-Z])/g, ' $1')}
            </span>
            <span className="text-yellow-400">{value}x</span>
          </button>
        ))}
      </div>

      {/* Bet Amount */}
      {selectedOption && (
        <div className="space-y-3 animate-in slide-in-from-bottom">
          <input
            type="number"
            placeholder="Montant (€)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={handlePlaceBet}
            disabled={!amount}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Placer le pari
          </button>

          {amount && (
            <p className="text-xs text-center text-white/60">
              Gain potentiel: {0/*(parseFloat(amount) * bet.odds[selectedOption]).toFixed(2)*/}€
            </p>
          )}
        </div>
      )}
    </div>
  );
}