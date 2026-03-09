import { useState, useEffect } from "react";
import { Wifi, Copy, Check, Users, RefreshCw, Play, LogIn } from "lucide-react";

interface ConnectedPlayer {
  id: string;
  name: string;
  avatarUrl: string;
  isHost?: boolean;
}

interface WebSocketLobbyProps {
  gameMode: "jornada" | "sobrevivencia";
}

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function getLocalIP() {
  // In a real app this would be detected server-side; for now we show the instruction
  return window.location.hostname;
}

function generateDiceBearUrl(seed: string) {
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(seed)}&backgroundColor=transparent`;
}

// Mock connected players for demo
const MOCK_PLAYERS: ConnectedPlayer[] = [
  {
    id: "host",
    name: "Anfitrião",
    avatarUrl: generateDiceBearUrl("host-seed-001"),
    isHost: true,
  },
];

const WebSocketLobby = ({ gameMode }: WebSocketLobbyProps) => {
  const [roomCode] = useState(generateRoomCode);
  const [host] = useState(getLocalIP);
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<ConnectedPlayer[]>(MOCK_PLAYERS);
  const [joinName, setJoinName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [view, setView] = useState<"host" | "join">("host");

  const joinUrl = `http://${host}:5173/join`;
  const fullUrl = `${joinUrl}?room=${roomCode}`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = () => {
    if (!joinName.trim()) {
      setJoinError("Digite seu nome para entrar");
      return;
    }
    if (joinCode.trim().toUpperCase() !== roomCode) {
      setJoinError("Código de sala inválido");
      return;
    }
    setJoinError("");
    setIsJoining(true);
    // Simulate joining
    setTimeout(() => {
      const seed = `join-${Date.now()}-${Math.random()}`;
      setPlayers((prev) => [
        ...prev,
        {
          id: seed,
          name: joinName.trim(),
          avatarUrl: generateDiceBearUrl(seed),
        },
      ]);
      setIsJoining(false);
      setView("host");
    }, 800);
  };

  return (
    <div className="ws-lobby">
      {/* Tab Toggle */}
      <div className="ws-tab-toggle">
        <button
          className={`ws-tab ${view === "host" ? "ws-tab-active" : ""}`}
          onClick={() => setView("host")}
        >
          <Wifi className="w-4 h-4" />
          Criar Sala
        </button>
        <button
          className={`ws-tab ${view === "join" ? "ws-tab-active" : ""}`}
          onClick={() => setView("join")}
        >
          <LogIn className="w-4 h-4" />
          Entrar na Sala
        </button>
      </div>

      {/* HOST VIEW */}
      {view === "host" && (
        <div className="ws-host-view">
          {/* Room Code */}
          <div className="ws-room-code-section">
            <p className="ws-section-label">Código da sala</p>
            <div className="ws-room-code-wrap">
              <span className="ws-room-code">{roomCode}</span>
              <button className="ws-copy-btn" onClick={copyCode} title="Copiar código">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Join URL */}
          <div className="ws-url-section">
            <p className="ws-section-label">Link para entrar</p>
            <div className="ws-url-wrap">
              <span className="ws-url-text">{fullUrl}</span>
              <button className="ws-copy-btn" onClick={copyUrl} title="Copiar link">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="ws-url-hint">
              Jogadores na mesma rede Wi-Fi podem abrir este link no celular
            </p>
          </div>

          {/* Players List */}
          <div className="ws-players-section">
            <div className="ws-players-header">
              <Users className="w-4 h-4" />
              <span>Jogadores na sala ({players.length})</span>
            </div>
            <div className="ws-players-list">
              {players.map((p) => (
                <div key={p.id} className="ws-player-row">
                  <img src={p.avatarUrl} alt={p.name} className="ws-player-avatar" />
                  <span className="ws-player-name">{p.name}</span>
                  {p.isHost && <span className="ws-host-badge">Anfitrião</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          {players.length >= 2 && (
            <button className="ws-start-btn">
              <Play className="w-5 h-5" />
              Iniciar Partida ({players.length} jogadores)
            </button>
          )}
          {players.length < 2 && (
            <p className="ws-waiting-text">
              Aguardando jogadores... (mínimo 2 para iniciar)
            </p>
          )}
        </div>
      )}

      {/* JOIN VIEW */}
      {view === "join" && (
        <div className="ws-join-view">
          <p className="ws-join-subtitle">
            Digite o código da sala e seu nome para entrar
          </p>

          <div className="ws-join-form">
            <div className="ws-form-field">
              <label className="ws-form-label">Código da sala</label>
              <input
                className="ws-form-input"
                placeholder="Ex: XKQZ9M"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
            </div>
            <div className="ws-form-field">
              <label className="ws-form-label">Seu nome</label>
              <input
                className="ws-form-input"
                placeholder="Como você quer ser chamado?"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                maxLength={16}
              />
            </div>
            {joinError && <p className="ws-join-error">{joinError}</p>}
            <button
              className="ws-join-btn"
              onClick={handleJoin}
              disabled={isJoining}
            >
              {isJoining ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isJoining ? "Conectando..." : "Entrar na Sala"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebSocketLobby;
