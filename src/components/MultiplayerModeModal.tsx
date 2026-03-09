import { useState } from "react";
import { Gamepad2, Wifi, X, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ControllerLobby from "@/components/ControllerLobby";
import WebSocketLobby from "@/components/WebSocketLobby";

type MultiplayerMode = "selection" | "controller" | "websocket";

interface MultiplayerModeModalProps {
  open: boolean;
  onClose: () => void;
  gameMode: "jornada" | "sobrevivencia";
}

const MultiplayerModeModal = ({ open, onClose, gameMode }: MultiplayerModeModalProps) => {
  const [mode, setMode] = useState<MultiplayerMode>("selection");

  const handleClose = () => {
    setMode("selection");
    onClose();
  };

  const handleBack = () => {
    setMode("selection");
  };

  const gameModeLabel = gameMode === "jornada" ? "Modo Jornada" : "Modo Sobrevivência";
  const gameModeColor = gameMode === "jornada" ? "jornada" : "sobrevivencia";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        hideCloseButton
        className="mp-modal-content"
      >
        {/* Header */}
        <div className="mp-modal-header">
          {mode !== "selection" && (
            <button className="mp-back-btn" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="mp-modal-title-wrap">
            <p className={`mp-modal-mode-label mp-mode-${gameModeColor}`}>{gameModeLabel}</p>
            <h2 className="mp-modal-title">
              {mode === "selection" && "Multiplayer"}
              {mode === "controller" && "Controles"}
              {mode === "websocket" && "Sala Online"}
            </h2>
          </div>
          <button className="mp-close-btn" onClick={handleClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selection Screen */}
        {mode === "selection" && (
          <div className="mp-selection">
            <p className="mp-selection-subtitle">Como os jogadores vão participar?</p>
            <div className="mp-selection-grid">
              {/* Controller Mode */}
              <button
                className="mp-mode-card mp-mode-card-controller"
                onClick={() => setMode("controller")}
              >
                <div className="mp-mode-card-icon">
                  <Gamepad2 className="w-10 h-10" />
                </div>
                <h3 className="mp-mode-card-title">Controles</h3>
                <p className="mp-mode-card-desc">
                  Cada jogador pressiona um botão no controle para se identificar e jogar no mesmo dispositivo
                </p>
                <div className="mp-mode-card-tag">Local • Mesmo Dispositivo</div>
              </button>

              {/* WebSocket Mode */}
              <button
                className="mp-mode-card mp-mode-card-websocket"
                onClick={() => setMode("websocket")}
              >
                <div className="mp-mode-card-icon">
                  <Wifi className="w-10 h-10" />
                </div>
                <h3 className="mp-mode-card-title">Sala Online</h3>
                <p className="mp-mode-card-desc">
                  Crie uma sala e convide jogadores na mesma rede Wi-Fi para se conectar com o código da sala
                </p>
                <div className="mp-mode-card-tag">Local • Rede LAN</div>
              </button>
            </div>
          </div>
        )}

        {/* Controller Lobby */}
        {mode === "controller" && (
          <ControllerLobby gameMode={gameMode} />
        )}

        {/* WebSocket Lobby */}
        {mode === "websocket" && (
          <WebSocketLobby gameMode={gameMode} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MultiplayerModeModal;
