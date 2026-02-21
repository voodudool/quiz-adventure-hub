import { useState } from "react";
import { Crown, Map, Skull, Sparkles } from "lucide-react";
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
        <button className="game-button button-jornada">
          <Map className="button-icon" />
          Modo Jornada
          <span className="button-subtitle">
            3 Estágios • 15 Perguntas • 3 Vidas
          </span>
        </button>

        {/* Modo Sobrevivência */}
        <button className="game-button button-sobrevivencia">
          <Skull className="button-icon" />
          Modo Sobrevivência
          <span className="button-subtitle">
            Sobreviva o máximo que puder
          </span>
        </button>

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
