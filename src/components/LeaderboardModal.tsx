import { Trophy, Map, Skull, Search, Heart, Clock, CheckCircle, XCircle, Hash, Star, ChevronDown } from "lucide-react";
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
  maxLives: number;
  time: number;
  completed: boolean;
}

interface SobrevivenciaEntry {
  name: string;
  survived: number;
  points: number;
  time: number;
}

const MOCK_JORNADA: JornadaEntry[] = [
  { name: "Carlos M.", points: 14850, lives: 3, maxLives: 3, time: 412, completed: true },
  { name: "Ana P.", points: 12300, lives: 2, maxLives: 3, time: 389, completed: true },
  { name: "Pedro S.", points: 9800, lives: 1, maxLives: 3, time: 520, completed: false },
  { name: "Maria L.", points: 7500, lives: 0, maxLives: 3, time: 345, completed: false },
  { name: "João R.", points: 5200, lives: 2, maxLives: 3, time: 610, completed: false },
  { name: "Lucas A.", points: 11200, lives: 3, maxLives: 3, time: 298, completed: true },
  { name: "Fernanda G.", points: 8900, lives: 1, maxLives: 3, time: 475, completed: false },
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


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="leaderboard-icon-button" aria-label="Leaderboard">
          <Trophy />
        </button>
      </DialogTrigger>
      <DialogContent className="leaderboard-modal">
        <DialogHeader>
          <DialogTitle className="settings-title">Ranking</DialogTitle>
        </DialogHeader>

        <div className="leaderboard-controls">
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

        </div>

        {/* Table */}
        <div className="leaderboard-table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="lb-th lb-th-rank"><Hash className="w-3.5 h-3.5" /></th>
                <th className="lb-th lb-th-name">Nome</th>
                {activeMode === "jornada" ? (
                  <>
                    <th className={`lb-th lb-th-center lb-th-sortable ${sortKeyJornada === "points" ? "lb-th-active" : ""}`} onClick={() => setSortKeyJornada("points")}><Star className="w-3.5 h-3.5" />{sortKeyJornada === "points" && <ChevronDown className="w-3 h-3 lb-sort-arrow" />}</th>
                    <th className={`lb-th lb-th-center lb-th-sortable ${sortKeyJornada === "lives" ? "lb-th-active" : ""}`} onClick={() => setSortKeyJornada("lives")}><Heart className="w-3.5 h-3.5" />{sortKeyJornada === "lives" && <ChevronDown className="w-3 h-3 lb-sort-arrow" />}</th>
                    <th className={`lb-th lb-th-center lb-th-sortable ${sortKeyJornada === "time" ? "lb-th-active" : ""}`} onClick={() => setSortKeyJornada("time")}><Clock className="w-3.5 h-3.5" />{sortKeyJornada === "time" && <ChevronDown className="w-3 h-3 lb-sort-arrow" />}</th>
                    <th className={`lb-th lb-th-center lb-th-sortable ${sortKeyJornada === "completed" ? "lb-th-active" : ""}`} onClick={() => setSortKeyJornada("completed")}>Status{sortKeyJornada === "completed" && <ChevronDown className="w-3 h-3 lb-sort-arrow" />}</th>
                  </>
                ) : (
                  <>
                    <th className={`lb-th lb-th-center lb-th-sortable ${sortKeySobrevivencia === "survived" ? "lb-th-active" : ""}`} onClick={() => setSortKeySobrevivencia("survived")}><Hash className="w-3.5 h-3.5" />{sortKeySobrevivencia === "survived" && <ChevronDown className="w-3 h-3 lb-sort-arrow" />}</th>
                    <th className={`lb-th lb-th-center lb-th-sortable ${sortKeySobrevivencia === "points" ? "lb-th-active" : ""}`} onClick={() => setSortKeySobrevivencia("points")}><Star className="w-3.5 h-3.5" />{sortKeySobrevivencia === "points" && <ChevronDown className="w-3 h-3 lb-sort-arrow" />}</th>
                    <th className={`lb-th lb-th-center lb-th-sortable ${sortKeySobrevivencia === "time" ? "lb-th-active" : ""}`} onClick={() => setSortKeySobrevivencia("time")}><Clock className="w-3.5 h-3.5" />{sortKeySobrevivencia === "time" && <ChevronDown className="w-3 h-3 lb-sort-arrow" />}</th>
                  </>
                )}
              </tr>
            </thead>
          </table>

          <div className="leaderboard-scroll-container">
            <div className="leaderboard-scroll-fade-top" />
            <div className="leaderboard-scroll-content">
              <table className="leaderboard-table">
                <tbody>
                  {activeMode === "jornada" && sortedJornada.length === 0 && (
                    <tr><td colSpan={6} className="leaderboard-empty">Nenhum jogador encontrado</td></tr>
                  )}
                  {activeMode === "sobrevivencia" && sortedSobrevivencia.length === 0 && (
                    <tr><td colSpan={5} className="leaderboard-empty">Nenhum jogador encontrado</td></tr>
                  )}

                  {activeMode === "jornada" && sortedJornada.map((entry, idx) => {
                    const rank = idx + 1;
                    return (
                      <tr key={entry.name} className={`lb-row ${rank <= 3 ? `rank-${rank}` : ""}`}>
                        <td className="lb-td lb-td-rank">
                          {rank <= 3 ? (
                            <Trophy className={`w-4 h-4 trophy-${rank}`} />
                          ) : (
                            <span className="lb-rank-num">{rank}</span>
                          )}
                        </td>
                        <td className="lb-td lb-td-name">{entry.name}</td>
                        <td className="lb-td lb-td-center">
                          <span className="lb-points">{entry.points.toLocaleString()}</span>
                        </td>
                        <td className="lb-td lb-td-center">
                          <span className="lb-lives-container">
                            <Heart className="w-3 h-3 lb-heart-icon" />
                            <span>{entry.lives}/{entry.maxLives}</span>
                          </span>
                        </td>
                        <td className="lb-td lb-td-center">
                          <span className="lb-time">{formatTime(entry.time)}</span>
                        </td>
                        <td className="lb-td lb-td-center">
                          {entry.completed ? (
                            <span className="lb-badge badge-complete">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Completo
                            </span>
                          ) : (
                            <span className="lb-badge badge-gameover">
                              <XCircle className="w-3.5 h-3.5" />
                              Game Over
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {activeMode === "sobrevivencia" && sortedSobrevivencia.map((entry, idx) => {
                    const rank = idx + 1;
                    return (
                      <tr key={entry.name} className={`lb-row ${rank <= 3 ? `rank-${rank}` : ""}`}>
                        <td className="lb-td lb-td-rank">
                          {rank <= 3 ? (
                            <Trophy className={`w-4 h-4 trophy-${rank}`} />
                          ) : (
                            <span className="lb-rank-num">{rank}</span>
                          )}
                        </td>
                        <td className="lb-td lb-td-name">{entry.name}</td>
                        <td className="lb-td lb-td-center">
                          <span className="lb-survived">{entry.survived}</span>
                        </td>
                        <td className="lb-td lb-td-center">
                          <span className="lb-points">{entry.points.toLocaleString()}</span>
                        </td>
                        <td className="lb-td lb-td-center">
                          <span className="lb-time">{formatTime(entry.time)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="leaderboard-scroll-fade-bottom" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardModal;
