import React, { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "/login" : "/register";

    try {
      const res = await fetch(`https://inculcative-shenita-watchfully.ngrok-free.dev${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur");
      }

      setMessage(isLogin ? "Connexion réussie" : "Compte créé");
      console.log("Réponse API:", data);
    } catch (err) {
      console.error("Erreur:", err);
      setMessage(err.message);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
      <form onSubmit={handleSubmit} style={{ width: 300 }}>
        <h2>{isLogin ? "Connexion" : "Créer un compte"}</h2>

        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button type="submit" style={{ width: "100%" }}>
          {isLogin ? "Se connecter" : "Créer un compte"}
        </button>

        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          style={{ width: "100%", marginTop: 10 }}
        >
          {isLogin
            ? "Créer un compte"
            : "Déjà un compte ? Se connecter"}
        </button>

        {message && (
          <p style={{ marginTop: 10 }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
