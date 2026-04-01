import { useEffect, useMemo, useRef, useState } from 'react';
import { Dice1, Bike, LayoutGrid, Map as MapIcon } from 'lucide-react';
import { BetCard } from './components/BetCard';
import { Header } from './components/Header';
import { StationsMap } from './components/StationsMap';
import { Utilisateur, MoyenneVelos, getMoyennes, getStationsInfo, StationInfo } from './api';

type ViewMode = 'cards' | 'map';

/** Moyenne API arrondie à un nombre entier de vélos (aligné sur le total entier de /nb_total). */
function bikesAverageRounded(raw: unknown): number {
  return Math.round(Number(raw));
}

export default function App() {
  const [moyennes, setMoyennes] = useState<MoyenneVelos[]>([]);
  const [stationInfos, setStationInfos] = useState<StationInfo[]>([]);
  const [utilisateur, setUtilisateur] = useState<Utilisateur>({ username: "", money: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
  const mapBetSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moyData, infoData] = await Promise.all([getMoyennes(), getStationsInfo()]);
        setMoyennes(moyData || []);
        setStationInfos(infoData || []);
      } catch (err) {
        console.error("Erreur lors du fetch :", err);
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const merged = useMemo(() => {
    const infoById = new Map(
      stationInfos
        .filter((s) => s.id_station != null)
        .map((s) => [s.id_station as number, s])
    );
    return moyennes.map((m) => {
      const info = m.num_station != null ? infoById.get(m.num_station) : undefined;
      const lat = info?.lat != null ? Number(info.lat) : undefined;
      const lon = info?.lon != null ? Number(info.lon) : undefined;
      return {
        ...m,
        lat: lat != null && !Number.isNaN(lat) ? lat : undefined,
        lon: lon != null && !Number.isNaN(lon) ? lon : undefined,
      };
    });
  }, [moyennes, stationInfos]);

  const bets = merged
    .filter((station) => {
      if (!station.nom || station.num_station == null || station.moyenne_velos === undefined) {
        return false;
      }
      const rounded = bikesAverageRounded(station.moyenne_velos);
      return !Number.isNaN(rounded);
    })
    .map((station) => {
      const averageRounded = bikesAverageRounded(station.moyenne_velos);
      return {
        id: station.num_station!,
        title: `VeloV: ${station.nom}`,
        description: "Le nombre actuel de vélos est-il au-dessus, en-dessous ou égal à la moyenne ?",
        icon: Bike,
        category: "Transport",
        currentValue: `Moyenne: ${averageRounded} vélos`,
        averageValue: averageRounded,
        odds: {
          Plus: 2.0,
          Moins: 2.0,
          Exactement: 5.0
        }
      };
    });

  const mapPoints = useMemo(
    () =>
      merged
        .filter(
          (m) =>
            m.nom &&
            m.num_station != null &&
            m.moyenne_velos !== undefined &&
            m.lat != null &&
            m.lon != null
        )
        .map((m) => ({
          id: m.num_station!,
          lat: m.lat!,
          lon: m.lon!,
          name: m.nom!,
        })),
    [merged]
  );

  const selectedBet = selectedStationId != null ? bets.find((b) => b.id === selectedStationId) : null;

  const handleBetPlaced = (newMoney: number) => {
    setUtilisateur({ ...utilisateur, money: newMoney });
  };

  const handleMapStationSelect = (id: number) => {
    setSelectedStationId(id);
    window.setTimeout(() => {
      mapBetSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header utilisateur={utilisateur} setUtilisateur={setUtilisateur} />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-6 py-2 mb-6">
            <Dice1 className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400">Projet École</span>
          </div>

          <h1 className="text-6xl mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Velo'v Gamble
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Pariez sur l'imprévisible : Les Vélo'vs de Lyon
          </p>

          {/* Grille ou carte */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setViewMode('cards');
                setSelectedStationId(null);
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                viewMode === 'cards'
                  ? 'bg-yellow-400/30 border-2 border-yellow-400 text-yellow-200 shadow-lg'
                  : 'bg-white/10 border border-white/20 text-white/90 hover:bg-white/15'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Grille
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-yellow-400/30 border-2 border-yellow-400 text-yellow-200 shadow-lg'
                  : 'bg-white/10 border border-white/20 text-white/90 hover:bg-white/15'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              Carte
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white">
            <p className="text-xl">Chargement des données...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p className="text-xl">Erreur : {error}</p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bets.map((bet) => (
              <BetCard
                key={bet.id}
                bet={bet}
                utilisateur={utilisateur}
                onBetPlaced={handleBetPlaced}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {mapPoints.length === 0 ? (
              <div className="text-center text-amber-200/90 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-6 py-8">
                <p className="text-lg">Aucune coordonnée GPS disponible pour afficher la carte.</p>
                <p className="text-sm text-white/70 mt-2">
                  Vérifiez que l’API expose bien <code className="text-yellow-200/90">GET /info_statique</code> avec les champs{' '}
                  <code className="text-yellow-200/90">lat</code> et <code className="text-yellow-200/90">lon</code>.
                </p>
              </div>
            ) : (
              <>
                <StationsMap
                  points={mapPoints}
                  selectedId={selectedStationId}
                  onSelect={handleMapStationSelect}
                />
                <p className="text-center text-sm text-white/60">
                  Cliquez sur un marqueur pour sélectionner une station, puis pariez ci-dessous.
                </p>
              </>
            )}

            {selectedBet ? (
              <div
                ref={mapBetSectionRef}
                className="max-w-lg mx-auto scroll-mt-6"
              >
                <h2 className="text-center text-white/90 text-lg font-medium mb-3">Pari sur la station sélectionnée</h2>
                <BetCard bet={selectedBet} utilisateur={utilisateur} onBetPlaced={handleBetPlaced} />
              </div>
            ) : mapPoints.length > 0 ? (
              <p className="text-center text-white/50 text-sm">Sélectionnez une station sur la carte pour placer un pari.</p>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
