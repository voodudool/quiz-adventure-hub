import { useState } from "react";
import { Crown, Map, Skull, Sparkles, User, Users } from "lucide-react";
import SettingsModal from "@/components/SettingsModal";
import LeaderboardModal from "@/components/LeaderboardModal";
import LoadingModal from "@/components/LoadingModal";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="game-menu">
      {isLoading && <LoadingModal onLoadComplete={() => setIsLoading(false)} />}
      {/* Settings Button - Top Right Corner */}
      <div className="settings-corner">
        <SettingsModal />
        <LeaderboardModal />
      </div>

      {/* Decorative Stars */}
      <div className="stars">
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
      </div>

      {/* Title Section */}
      <h1 className="game-title">Quiz Master</h1>
      <div className="decorative-line" />
      <p className="game-subtitle">Escolha seu modo de jogo</p>

      {/* Menu Buttons */}
      <div className="menu-buttons">
        {/* Show do Milhão */}
        <button className="game-button button-milhao coming-soon" disabled>
          <Crown className="button-icon" />
          Show do Milhão
          <span className="button-subtitle">
            Responda e ganhe prêmios crescentes
          </span>
          <span className="coming-soon-badge">Em breve...</span>
        </button>

        {/* Modo Jornada */}
        <div className="game-button-group">
          <div className="game-button-label">
            <Map className="button-icon-sm" />
            <span>Modo Jornada</span>
            <span className="button-group-subtitle">3 Estágios • 15 Perguntas • 3 Vidas</span>
          </div>
          <div className="game-button-actions">
            <button className="game-subbutton subbutton-jornada">
              <User className="subbutton-icon" />
              Solo
            </button>
            <button className="game-subbutton subbutton-jornada subbutton-multi">
              <Users className="subbutton-icon" />
              Multiplayer
            </button>
          </div>
        </div>

        {/* Modo Sobrevivência */}
        <div className="game-button-group game-button-group-sobrevivencia">
          <div className="game-button-label">
            <Skull className="button-icon-sm" />
            <span>Modo Sobrevivência</span>
            <span className="button-group-subtitle">Sobreviva o máximo que puder</span>
          </div>
          <div className="game-button-actions">
            <button className="game-subbutton subbutton-sobrevivencia">
              <User className="subbutton-icon" />
              Solo
            </button>
            <button className="game-subbutton subbutton-sobrevivencia subbutton-multi">
              <Users className="subbutton-icon" />
              Multiplayer
            </button>
          </div>
        </div>

        {/* Custom Mode */}
        <button className="game-button button-custom coming-soon" disabled>
          <Sparkles className="button-icon" />
          Modo Personalizado
          <span className="button-subtitle">
            Configure seu próprio desafio
          </span>
          <span className="coming-soon-badge">Em breve...</span>
        </button>
      </div>

      {/* Footer */}
      <p className="menu-footer">© 2024 Quiz Master</p>
    </div>
  );
};

export default Index;
