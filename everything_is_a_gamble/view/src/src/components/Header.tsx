import { useState, useEffect, useRef } from 'react';
import { Wallet, Trophy, Menu, LogOut } from 'lucide-react';
import { AuthPage } from './AuthPage';
import { Utilisateur } from '../api';

type HeaderProps = {
  utilisateur: Utilisateur
  setUtilisateur: (u: Utilisateur) => void
}

export function Header({ utilisateur, setUtilisateur }: HeaderProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setUtilisateur({ username: "", money: 0 });
    setShowMenu(false);
  };

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <>
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md relative">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white">Velo'v Gamble</h2>
              <p className="text-xs text-white/60">Projet École</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {utilisateur.username && (
              <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
                <Wallet className="w-5 h-5 text-green-400" />
                <span className="text-white">
                  {(utilisateur.money ?? 0).toLocaleString()}€
                </span>
              </div>
            )}
            {!utilisateur.username && (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Connexion
              </button>
            )}

            {/* Menu déroulant */}
            {utilisateur.username && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-white" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-800">Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[350px]">
            <AuthPage setUtilisateur={setUtilisateur} />
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
