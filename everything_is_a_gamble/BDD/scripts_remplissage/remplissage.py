import requests
import psycopg2
import time
from datetime import datetime
import requests

try:
    r = requests.get("https://www.google.com")
    print("Internet OK")
except:
    print("Pas d'internet")

# Connexion PostgreSQL
conn = psycopg2.connect(
    dbname="velov",
    user="alexis",
    password="moi123",
    host="localhost",
    port=5432
)

cursor = conn.cursor()

# URLs API
STATUS_URL = "https://download.data.grandlyon.com/files/rdata/jcd_jcdecaux.jcdvelov/station_status.json"
INFO_URL = "https://download.data.grandlyon.com/files/rdata/jcd_jcdecaux.jcdvelov/station_information.json"

# --------------------------------------------------
# INITIALISATION DES STATIONS (UNE SEULE FOIS)
# --------------------------------------------------
def init_stations():
    print("Initialisation des stations...")

    response = requests.get(INFO_URL)
    data = response.json()

    stations = data["data"]["stations"]

    for station in stations:
        station_id = station["station_id"]
        name = station["name"]

        try:
            cursor.execute("""
                INSERT INTO nom_stations (nom, id_station)
                VALUES (%s, %s)
                ON CONFLICT (id_station) DO NOTHING;
            """, (name, station_id))
        except Exception as e:
            print("Erreur insertion status:", e)
            conn.rollback()  # important pour “débloquer” la transaction
        else:
            conn.commit()

    print("Stations initialisées !")

# --------------------------------------------------
# RÉCUPÉRATION DES DONNÉES TOUTES LES 5 MIN
# --------------------------------------------------
def fetch_and_store():
    print("Récupération des données...")

    response = requests.get(STATUS_URL)
    data = response.json()

    stations = data["data"]["stations"]



    for station in stations:
        station_id = station["station_id"]

        for v in station.get("vehicle_types_available", []):
            if v["vehicle_type_id"] == "electrical":
                velo_elec = v["count"]
            elif v["vehicle_type_id"] == "mechanical":
                velo_normal = v["count"]

        timestamp = station["last_reported"]

        try:
            cursor.execute("""
                INSERT INTO nb_velos (num_station, horodatage, velo_normal, velo_elec)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT(num_station, horodatage) DO NOTHING
            """, (station_id, timestamp, velo_normal, velo_elec))
        except Exception as e:
            print("Erreur insertion vélo:", e)
            conn.rollback()  # important pour “débloquer” la transaction
        else:
            conn.commit()

    print("Données enregistrées à", datetime.now())

# --------------------------------------------------
#  MAIN
# --------------------------------------------------
if __name__ == "__main__":
    
    # À lancer UNE SEULE FOIS
    init_stations()

    # Boucle infinie toutes les 5 minutes
    while True:
        fetch_and_store()
        time.sleep(300)  # 300 sec = 5 min