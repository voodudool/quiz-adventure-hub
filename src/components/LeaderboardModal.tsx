import { Trophy, Map, Skull, Search, ArrowDownWideNarrow } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type GameMode = "jornada" | "sobrevivencia";

type SortKeyJornada = "points" | "lives" | "time" | "completed";
type SortKeySobrevivencia = "survived" | "points" | "time";

interface JornadaEntry {
  name: string;
  points: number;
  lives: number;
  time: number; // seconds
  completed: boolean;
}

interface SobrevivenciaEntry {
  name: string;
  survived: number;
  points: number;
  time: number; // seconds
}

const MOCK_JORNADA: JornadaEntry[] = [
  { name: "Carlos M.", points: 14850, lives: 3, time: 412, completed: true },
  { name: "Ana P.", points: 12300, lives: 2, time: 389, completed: true },
  { name: "Pedro S.", points: 9800, lives: 1, time: 520, completed: false },
  { name: "Maria L.", points: 7500, lives: 0, time: 345, completed: false },
  { name: "João R.", points: 5200, lives: 2, time: 610, completed: false },
  { name: "Lucas A.", points: 11200, lives: 3, time: 298, completed: true },
  { name: "Fernanda G.", points: 8900, lives: 1, time: 475, completed: false },
];

const MOCK_SOBREVIVENCIA: SobrevivenciaEntry[] = [
  { name: "Lucas F.", survived: 42, points: 8400, time: 1260 },
  { name: "Bruna K.", survived: 38, points: 7200, time: 1140 },
  { name: "Rafael D.", survived: 31, points: 5800, time: 930 },
  { name: "Camila N.", survived: 25, points: 4500, time: 750 },
  { name: "Thiago V.", survived: 19, points: 3200, time: 570 },
  { name: "Sofia R.", survived: 35, points: 6800, time: 1050 },
];

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const JORNADA_SORT_OPTIONS: { key: SortKeyJornada; label: string }[] = [
  { key: "points", label: "Pontos" },
  { key: "lives", label: "Vidas" },
  { key: "time", label: "Tempo" },
  { key: "completed", label: "Completo" },
];

const SOBREVIVENCIA_SORT_OPTIONS: { key: SortKeySobrevivencia; label: string }[] = [
  { key: "survived", label: "Rodadas" },
  { key: "points", label: "Pontos" },
  { key: "time", label: "Tempo" },
];

const LeaderboardModal = () => {
  const [open, setOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<GameMode>("jornada");
  const [sortKeyJornada, setSortKeyJornada] = useState<SortKeyJornada>("points");
  const [sortKeySobrevivencia, setSortKeySobrevivencia] = useState<SortKeySobrevivencia>("survived");
  const [searchQuery, setSearchQuery] = useState("");

  const sortedJornada = useMemo(() => {
    let data = [...MOCK_JORNADA];
    if (searchQuery) {
      data = data.filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    data.sort((a, b) => {
      if (sortKeyJornada === "completed") return (b.completed ? 1 : 0) - (a.completed ? 1 : 0);
      return (b[sortKeyJornada] as number) - (a[sortKeyJornada] as number);
    });
    return data;
  }, [sortKeyJornada, searchQuery]);

  const sortedSobrevivencia = useMemo(() => {
    let data = [...MOCK_SOBREVIVENCIA];
    if (searchQuery) {
      data = data.filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    data.sort((a, b) => (b[sortKeySobrevivencia] as number) - (a[sortKeySobrevivencia] as number));
    return data;
  }, [sortKeySobrevivencia, searchQuery]);

  const currentSortOptions = activeMode === "jornada" ? JORNADA_SORT_OPTIONS : SOBREVIVENCIA_SORT_OPTIONS;
  const currentSortKey = activeMode === "jornada" ? sortKeyJornada : sortKeySobrevivencia;

  const handleSortChange = (key: string) => {
    if (activeMode === "jornada") setSortKeyJornada(key as SortKeyJornada);
    else setSortKeySobrevivencia(key as SortKeySobrevivencia);
  };

  const entries = activeMode === "jornada" ? sortedJornada : sortedSobrevivencia;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="leaderboard-icon-button" aria-label="Leaderboard">
          <Trophy />
        </button>
      </DialogTrigger>
      <DialogContent className="settings-modal">
        <DialogHeader>
          <DialogTitle className="settings-title">Ranking</DialogTitle>
        </DialogHeader>

        <div className="settings-content">
          {/* Mode Tabs */}
          <div className="leaderboard-tabs">
            <button
              className={`leaderboard-tab tab-jornada ${activeMode === "jornada" ? "active" : ""}`}
              onClick={() => setActiveMode("jornada")}
            >
              <Map className="w-4 h-4" />
              Jornada
            </button>
            <button
              className={`leaderboard-tab tab-sobrevivencia ${activeMode === "sobrevivencia" ? "active" : ""}`}
              onClick={() => setActiveMode("sobrevivencia")}
            >
              <Skull className="w-4 h-4" />
              Sobrevivência
            </button>
          </div>

          {/* Search */}
          <div className="leaderboard-search">
            <Search className="leaderboard-search-icon" />
            <input
              type="text"
              placeholder="Buscar jogador..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="leaderboard-search-input"
            />
          </div>

          {/* Sort Filters */}
          <div className="leaderboard-sort">
            <ArrowDownWideNarrow className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
            {currentSortOptions.map((opt) => (
              <button
                key={opt.key}
                className={`leaderboard-sort-btn ${currentSortKey === opt.key ? "active" : ""}`}
                onClick={() => handleSortChange(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Leaderboard List */}
          <div className="leaderboard-list">
            {entries.length === 0 && (
              <div className="leaderboard-empty">Nenhum jogador encontrado</div>
            )}
            {entries.map((entry, idx) => {
              const rank = idx + 1;
              return (
                <div
                  key={entry.name}
                  className={`leaderboard-entry ${rank <= 3 ? `rank-${rank}` : ""}`}
                >
                  <div className="leaderboard-rank">
                    {rank <= 3 ? (
                      <Trophy className={`w-5 h-5 trophy-${rank}`} />
                    ) : (
                      <span>{rank}</span>
                    )}
                  </div>
                  <div className="leaderboard-name">{entry.name}</div>

                  {activeMode === "jornada" && (
                    <div className="leaderboard-stats">
                      <span className="lb-stat" title="Pontos">{(entry as JornadaEntry).points.toLocaleString()} pts</span>
                      <span className="lb-stat" title="Vidas">❤️ {(entry as JornadaEntry).lives}</span>
                      <span className="lb-stat" title="Tempo">⏱ {formatTime((entry as JornadaEntry).time)}</span>
                      <span className={`lb-badge ${(entry as JornadaEntry).completed ? "badge-complete" : "badge-gameover"}`}>
                        {(entry as JornadaEntry).completed ? "✓ Completo" : "✗ Game Over"}
                      </span>
                    </div>
                  )}

                  {activeMode === "sobrevivencia" && (
                    <div className="leaderboard-stats">
                      <span className="lb-stat" title="Rodadas">{(entry as SobrevivenciaEntry).survived} rodadas</span>
                      <span className="lb-stat" title="Pontos">{(entry as SobrevivenciaEntry).points.toLocaleString()} pts</span>
                      <span className="lb-stat" title="Tempo">⏱ {formatTime((entry as SobrevivenciaEntry).time)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardModal;
