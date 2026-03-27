import { useState } from 'react';
import { Wallet, Trophy, Menu } from 'lucide-react';
import AuthPage from './AuthPage'; // ⚠️ corrige l'import en utilisant default export

interface HeaderProps {
  balance: number;
}

export default function Header({ balance }: HeaderProps) {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md relative">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
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

            <button
              onClick={() => setShowAuth(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Connexion
            </button>

            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </header>

      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[350px]">
            <AuthPage />
            <button
              onClick={() => setShowAuth(false)}
              className="mt-4 w-full bg-gray-200 py-2 rounded-lg"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}