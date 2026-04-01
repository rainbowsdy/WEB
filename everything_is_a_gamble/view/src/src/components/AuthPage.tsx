import React, { useState } from "react";
import { login, register, Utilisateur } from "../api";

type AuthPageProps = {
  setUtilisateur: (u: Utilisateur) => void
}

export function AuthPage({ setUtilisateur }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Fonction helper pour mettre à jour l'utilisateur après authentification
  const handleAuthSuccess = (data: { username?: string; money?: number } | undefined) => {
    if (data && data.username && data.money !== undefined) {
      setUtilisateur({
        username: data.username,
        money: data.money
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Connexion
        const data = await login(username, password);
        setMessage("Connexion réussie");
        handleAuthSuccess(data);
      } else {
        // Inscription
        await register(username, password);
        setMessage("Compte créé avec succès");
        // Après inscription, connecter automatiquement
        const loginData = await login(username, password);
        handleAuthSuccess(loginData);
      }
      console.log("Authentification réussie");
    } catch (err) {
      console.error("Erreur:", err);
      setMessage(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  return (
    <div className="flex justify-center mt-24">
      <form onSubmit={handleSubmit} className="w-[300px]">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {isLogin ? "Connexion" : "Créer un compte"}
        </h2>

        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 rounded-lg transition-all"
        >
          {isLogin ? "Se connecter" : "Créer un compte"}
        </button>

        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors"
        >
          {isLogin
            ? "Créer un compte"
            : "Déjà un compte ? Se connecter"}
        </button>

        {message && (
          <p className={`mt-3 text-center ${message.includes('réussie') || message.includes('succès') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
