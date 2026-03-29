#!/usr/bin/bash


# Vérifier PostgreSQL
if pg_isready -h localhost -p 5432; then
    echo "BDD online"
else
    echo "PostgreSQL non accessible. Vérifie que le service est lancé."
    exit 1
fi

# Lancer Node.js
node API/api.js &
NODE_PID=$!

sleep 10

# Lancer ngrok
ngrok http 3001 
NGROK_PID=$!

echo "Arrêt des processus..."
kill $NODE_PID 2>/dev/null
kill $NGROK_PID 2>/dev/null
echo "Tous les processus sont arrêtés."