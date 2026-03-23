#!/usr/bin/bash

# Vérifier que PostgreSQL est accessible
if pg_isready -h localhost -p 5432; then
    echo "BDD online"
else
    echo "PostgreSQL non accessible. Vérifie que le service est lancé."
    exit 1
fi

#lancer le script de remplissage
python3 scripts_remplissage/remplissage.py &

# Lancer Node.js
node API/api.js &
NODE_PID=$!
sleep 10

# Lancer ngrok
ngrok http 3001 
NGROK_PID=$!
