import { useState } from "react";
import { Settings, Volume2, List, Folder, Save, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CATEGORIES = [
  "História",
  "Geografia",
  "Ciências",
  "Literatura",
  "Matemática",
  "Esportes",
  "Música",
  "Cinema",
  "Arte",
  "Tecnologia",
  "Culinária",
  "Política",
  "Religião",
  "Mitologia",
  "Astronomia",
];

interface SavedList {
  name: string;
  categories: string[];
}

const SettingsModal = () => {
  const [open, setOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  
  // Audio settings
  const [masterVolume, setMasterVolume] = useState([75]);
  const [bgmVolume, setBgmVolume] = useState([50]);
  const [sfxVolume, setSfxVolume] = useState([80]);
  
  // Answer style
  const [answerStyle, setAnswerStyle] = useState<"letters" | "numbers">("letters");
  
  // Categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [newListName, setNewListName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const selectAllCategories = () => setSelectedCategories(CATEGORIES);
  const deselectAllCategories = () => setSelectedCategories([]);

  const saveList = () => {
    if (newListName.trim() && selectedCategories.length > 0) {
      setSavedLists((prev) => [
        ...prev.filter((l) => l.name !== newListName),
        { name: newListName, categories: selectedCategories },
      ]);
      setNewListName("");
      setShowSaveInput(false);
    }
  };

  const loadList = (list: SavedList) => {
    setSelectedCategories(list.categories);
  };

  const deleteList = (name: string) => {
    setSavedLists((prev) => prev.filter((l) => l.name !== name));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="game-button button-config">
          <Settings className="button-icon" />
          Configurações
          <span className="button-subtitle">Ajuste áudio, estilo e categorias</span>
        </button>
      </DialogTrigger>
      <DialogContent className="settings-modal">
        <DialogHeader>
          <DialogTitle className="settings-title">Configurações</DialogTitle>
        </DialogHeader>

        {!showCategories ? (
          <div className="settings-content">
            {/* Audio Section */}
            <div className="settings-section">
              <div className="section-header">
                <Volume2 className="section-icon" />
                <h3>Áudio</h3>
              </div>
              <div className="volume-controls">
                <div className="volume-item">
                  <Label>Master Volume</Label>
                  <div className="volume-slider">
                    <Slider
                      value={masterVolume}
                      onValueChange={setMasterVolume}
                      max={100}
                      step={1}
                    />
                    <span className="volume-value">{masterVolume}%</span>
                  </div>
                </div>
                <div className="volume-item">
                  <Label>BGM Volume</Label>
                  <div className="volume-slider">
                    <Slider
                      value={bgmVolume}
                      onValueChange={setBgmVolume}
                      max={100}
                      step={1}
                    />
                    <span className="volume-value">{bgmVolume}%</span>
                  </div>
                </div>
                <div className="volume-item">
                  <Label>SFX Volume</Label>
                  <div className="volume-slider">
                    <Slider
                      value={sfxVolume}
                      onValueChange={setSfxVolume}
                      max={100}
                      step={1}
                    />
                    <span className="volume-value">{sfxVolume}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Style Section */}
            <div className="settings-section">
              <div className="section-header">
                <List className="section-icon" />
                <h3>Estilo das Respostas</h3>
              </div>
              <div className="answer-style-options">
                <button
                  className={`style-option ${answerStyle === "letters" ? "active" : ""}`}
                  onClick={() => setAnswerStyle("letters")}
                >
                  <span className="style-preview">A B C D</span>
                  <span>Letras</span>
                </button>
                <button
                  className={`style-option ${answerStyle === "numbers" ? "active" : ""}`}
                  onClick={() => setAnswerStyle("numbers")}
                >
                  <span className="style-preview">1 2 3 4</span>
                  <span>Números</span>
                </button>
              </div>
            </div>

            {/* Categories Button */}
            <div className="settings-section">
              <div className="section-header">
                <Folder className="section-icon" />
                <h3>Categorias</h3>
              </div>
              <button
                className="categories-button"
                onClick={() => setShowCategories(true)}
              >
                Gerenciar Categorias
                <span className="categories-count">
                  {selectedCategories.length}/{CATEGORIES.length} selecionadas
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="categories-panel">
            <button
              className="back-button"
              onClick={() => setShowCategories(false)}
            >
              ← Voltar
            </button>

            <div className="categories-actions">
              <Button variant="outline" size="sm" onClick={selectAllCategories}>
                Selecionar Todas
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAllCategories}>
                Desmarcar Todas
              </Button>
            </div>

            <div className="categories-list">
              {CATEGORIES.map((category) => (
                <label key={category} className="category-item">
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>

            {/* Save/Load Section */}
            <div className="lists-section">
              <h4>Listas Salvas</h4>
              
              {showSaveInput ? (
                <div className="save-input-container">
                  <Input
                    placeholder="Nome da lista..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveList()}
                  />
                  <Button size="sm" onClick={saveList}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSaveInput(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveInput(true)}
                  className="save-list-button"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Lista Atual
                </Button>
              )}

              {savedLists.length > 0 && (
                <div className="saved-lists">
                  {savedLists.map((list) => (
                    <div key={list.name} className="saved-list-item">
                      <span className="list-name">{list.name}</span>
                      <span className="list-count">
                        ({list.categories.length})
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => loadList(list)}
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteList(list.name)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
