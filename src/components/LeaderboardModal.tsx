import { Trophy, Map, Skull } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type GameMode = "jornada" | "sobrevivencia";

const MOCK_LEADERBOARD = {
  jornada: [
    { rank: 1, name: "Carlos M.", score: 14850, stage: "3/3" },
    { rank: 2, name: "Ana P.", score: 12300, stage: "3/3" },
    { rank: 3, name: "Pedro S.", score: 9800, stage: "2/3" },
    { rank: 4, name: "Maria L.", score: 7500, stage: "2/3" },
    { rank: 5, name: "João R.", score: 5200, stage: "1/3" },
  ],
  sobrevivencia: [
    { rank: 1, name: "Lucas F.", score: 42, stage: undefined },
    { rank: 2, name: "Bruna K.", score: 38, stage: undefined },
    { rank: 3, name: "Rafael D.", score: 31, stage: undefined },
    { rank: 4, name: "Camila N.", score: 25, stage: undefined },
    { rank: 5, name: "Thiago V.", score: 19, stage: undefined },
  ],
};

const LeaderboardModal = () => {
  const [open, setOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<GameMode>("jornada");

  const leaderboard = MOCK_LEADERBOARD[activeMode];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="settings-icon-button" aria-label="Leaderboard">
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

          {/* Leaderboard List */}
          <div className="leaderboard-list">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`leaderboard-entry ${entry.rank <= 3 ? `rank-${entry.rank}` : ""}`}
              >
                <div className="leaderboard-rank">
                  {entry.rank <= 3 ? (
                    <Trophy className={`w-5 h-5 trophy-${entry.rank}`} />
                  ) : (
                    <span>{entry.rank}</span>
                  )}
                </div>
                <div className="leaderboard-name">{entry.name}</div>
                <div className="leaderboard-score">
                  {activeMode === "jornada"
                    ? `${entry.score.toLocaleString()} pts`
                    : `${entry.score} rodadas`}
                </div>
                {entry.stage && (
                  <div className="leaderboard-stage">{entry.stage}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardModal;
