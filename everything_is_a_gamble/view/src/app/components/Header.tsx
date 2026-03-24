import { Wallet, Trophy, Menu } from 'lucide-react';

interface HeaderProps {
  balance: number;
}

export function Header({ balance }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white">Everything is a Gamble</h2>
              <p className="text-xs text-white/60">Projet École</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
              <Wallet className="w-5 h-5 text-green-400" />
              <span className="text-white">{balance.toLocaleString()}€</span>
            </div>

            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}