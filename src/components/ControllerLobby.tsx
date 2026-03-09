import { useState, useEffect, useCallback } from "react";
import { Gamepad2, Edit2, Check, Trash2, Play } from "lucide-react";

interface Player {
  id: string;
  name: string;
  avatarUrl: string;
  controllerIndex: number;
  color: string;
}

interface ControllerLobbyProps {
  gameMode: "jornada" | "sobrevivencia";
}

const PLAYER_COLORS = [
  "hsl(200 100% 55%)",
  "hsl(0 85% 60%)",
  "hsl(120 70% 50%)",
  "hsl(45 100% 55%)",
  "hsl(280 80% 65%)",
  "hsl(30 100% 55%)",
];

const PLAYER_COLOR_NAMES = ["azul", "vermelho", "verde", "dourado", "roxo", "laranja"];

function generateDiceBearUrl(seed: string) {
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(seed)}&backgroundColor=transparent`;
}

function generateRandomName(index: number) {
  const names = ["Jogador", "Player", "Quiz", "Mestre", "Campeão", "Astro"];
  const suffix = Math.floor(Math.random() * 900) + 100;
  return `${names[index % names.length]}${suffix}`;
}

const ControllerLobby = ({ gameMode }: ControllerLobbyProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [waitingPress, setWaitingPress] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [pressedControllers, setPressedControllers] = useState<Set<number>>(new Set());

  const addPlayerFromController = useCallback((controllerIndex: number) => {
    if (pressedControllers.has(controllerIndex) || players.length >= 6) return;

    const playerIndex = players.length;
    const seed = `${Date.now()}-player-${playerIndex}`;
    const newPlayer: Player = {
      id: seed,
      name: generateRandomName(playerIndex),
      avatarUrl: generateDiceBearUrl(seed),
      controllerIndex,
      color: PLAYER_COLORS[playerIndex % PLAYER_COLORS.length],
    };

    setPlayers((prev) => [...prev, newPlayer]);
    setPressedControllers((prev) => new Set([...prev, controllerIndex]));
  }, [players.length, pressedControllers]);

  // Gamepad polling
  useEffect(() => {
    let animFrameId: number;

    const poll = () => {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (!gp) continue;
        // Any button pressed registers the controller
        const anyPressed = gp.buttons.some((btn) => btn.pressed);
        if (anyPressed) {
          addPlayerFromController(i);
        }
      }
      animFrameId = requestAnimationFrame(poll);
    };

    animFrameId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(animFrameId);
  }, [addPlayerFromController]);

  // Also listen for keyboard (for testing without controllers)
  useEffect(() => {
    const KEYBOARD_MAP: Record<string, number> = {
      "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5,
    };
    const handleKey = (e: KeyboardEvent) => {
      const idx = KEYBOARD_MAP[e.key];
      if (idx !== undefined) {
        addPlayerFromController(idx);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [addPlayerFromController]);

  const removePlayer = (id: string) => {
    const player = players.find((p) => p.id === id);
    if (!player) return;
    setPressedControllers((prev) => {
      const next = new Set(prev);
      next.delete(player.controllerIndex);
      return next;
    });
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const startEditing = (player: Player) => {
    setEditingId(player.id);
    setEditingName(player.name);
  };

  const saveEdit = (id: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: editingName.trim() || p.name } : p))
    );
    setEditingId(null);
  };

  const regenerateAvatar = (id: string) => {
    const newSeed = `${Date.now()}-regen-${Math.random()}`;
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, avatarUrl: generateDiceBearUrl(newSeed) } : p))
    );
  };

  return (
    <div className="ctrl-lobby">
      {/* Waiting Banner */}
      <div className="ctrl-waiting-banner">
        <Gamepad2 className="w-5 h-5" />
        <span>
          {players.length === 0
            ? "Pressione qualquer botão no controle para entrar"
            : players.length < 2
            ? "Aguardando mais jogadores... (mín. 2)"
            : "Pressione qualquer botão no controle para adicionar mais jogadores"}
        </span>
      </div>

      {/* Keyboard hint */}
      <p className="ctrl-keyboard-hint">
        Sem controle? Use as teclas <kbd>1</kbd>–<kbd>6</kbd> para simular jogadores
      </p>

      {/* Players Grid */}
      {players.length > 0 && (
        <div className="ctrl-players-grid">
          {players.map((player, idx) => (
            <div
              key={player.id}
              className="ctrl-player-card"
              style={{ "--player-color": player.color } as React.CSSProperties}
            >
              <div className="ctrl-player-badge">P{idx + 1}</div>

              {/* Avatar */}
              <button
                className="ctrl-avatar-wrap"
                onClick={() => regenerateAvatar(player.id)}
                title="Clique para mudar o avatar"
              >
                <img
                  src={player.avatarUrl}
                  alt={`Avatar de ${player.name}`}
                  className="ctrl-avatar"
                />
                <div className="ctrl-avatar-overlay">
                  <span className="text-xs">Mudar</span>
                </div>
              </button>

              {/* Name */}
              <div className="ctrl-player-name-wrap">
                {editingId === player.id ? (
                  <div className="ctrl-name-edit">
                    <input
                      className="ctrl-name-input"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(player.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      autoFocus
                      maxLength={16}
                    />
                    <button className="ctrl-name-save" onClick={() => saveEdit(player.id)}>
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="ctrl-name-display">
                    <span className="ctrl-player-name">{player.name}</span>
                    <button className="ctrl-name-edit-btn" onClick={() => startEditing(player)}>
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <span className="ctrl-controller-label">
                  <Gamepad2 className="w-3 h-3" />
                  {PLAYER_COLOR_NAMES[player.controllerIndex % PLAYER_COLOR_NAMES.length]}
                </span>
              </div>

              {/* Remove */}
              <button className="ctrl-remove-btn" onClick={() => removePlayer(player.id)}>
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {players.length === 0 && (
        <div className="ctrl-empty">
          <div className="ctrl-empty-icons">
            <Gamepad2 className="w-12 h-12 opacity-30" />
          </div>
          <p className="ctrl-empty-text">Nenhum jogador conectado</p>
        </div>
      )}

      {/* Start Button */}
      {players.length >= 2 && (
        <button className="ctrl-start-btn">
          <Play className="w-5 h-5" />
          Iniciar com {players.length} Jogadores
        </button>
      )}
    </div>
  );
};

export default ControllerLobby;
