### Instructions pour lancer l'API
Il suffit de simplement lancer le script `script_lancer_tout.sh`

Si il y a une erreur, essayer la commande `dos2unix script_lancer_tout.sh` puis relancer le script

A l'execution du script ngrok ouvrira dans le terminal une sorte de fenetre indiquant diverses infos, nottament l'url sur l'internet de l'api
### Instructions pour lancer le remplissage de l'API
```bash
python3 -m venv venv 
source venv/bin/activate
pip install -r bdd_fill/requirements.txt
python3 bdd_fill/remplissage.py
```
et le remplissage se lancera toute les 5 minutes

#### LA BASE DE DONNÉES EST STOCKÉE EN LOCAL SUR MON (Alexis) ORDI 
en tout cas pour l'instant