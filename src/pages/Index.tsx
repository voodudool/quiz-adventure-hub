import { Crown, Map, Skull } from "lucide-react";
import SettingsModal from "@/components/SettingsModal";

const Index = () => {
  return (
    <div className="game-menu">
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
        <button className="game-button button-milhao">
          <Crown className="button-icon" />
          Show do Milhão
          <span className="button-subtitle">
            Responda e ganhe prêmios crescentes
          </span>
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

        {/* Settings */}
        <SettingsModal />
      </div>

      {/* Footer */}
      <p className="menu-footer">© 2024 Quiz Master</p>
    </div>
  );
};

export default Index;
