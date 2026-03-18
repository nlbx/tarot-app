import { useState } from 'react';
import tarotData from './data/tarot.json';

type Card = {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  image: string;
  meaning: string;
  reverse: string;
};

type SpreadType = 'single' | 'three';

interface SelectedCard {
  card: Card;
  isInverted: boolean;
}

function App() {
  const [spreadType, setSpreadType] = useState<SpreadType>('single');
  const [invertedEnabled, setInvertedEnabled] = useState(false);
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [showMeaning, setShowMeaning] = useState(false);

  const drawCards = () => {
    const count = spreadType === 'single' ? 1 : 3;
    const newCards: SelectedCard[] = [];
    const usedIndices = new Set<number>();

    for (let i = 0; i < count; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * tarotData.cards.length);
      } while (usedIndices.has(randomIndex));
      usedIndices.add(randomIndex);

      const card = tarotData.cards[randomIndex];
      const isInverted = invertedEnabled && Math.random() < 0.5;

      newCards.push({ card, isInverted });
    }

    setSelectedCards(newCards);
    setFlipped(new Array(count).fill(false));
    setShowMeaning(false);

    // Flip cards one by one
    newCards.forEach((_, index) => {
      setTimeout(() => {
        setFlipped(prev => {
          const newFlipped = [...prev];
          newFlipped[index] = true;
          return newFlipped;
        });
      }, 200 + index * 300);
    });

    setTimeout(() => setShowMeaning(true), 1500 + count * 300);
  };

  return (
    <div className="app">
      <header>
        <h1>Расклад Таро</h1>
      </header>

      <main>
        <div className="controls">
          <div className="control-group">
            <label htmlFor="spread-select">Расклад:</label>
            <select
              id="spread-select"
              value={spreadType}
              onChange={(e) => setSpreadType(e.target.value as SpreadType)}
            >
              <option value="single">Однокарточный</option>
              <option value="three">Трехкарточный</option>
            </select>
          </div>
          <div className="control-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={invertedEnabled}
                onChange={(e) => setInvertedEnabled(e.target.checked)}
              />
              Перевернутые карты (random)
            </label>
          </div>
        </div>

        <div className="deck-area">
          {selectedCards.length === 0 ? (
            <p className="placeholder">
              {spreadType === 'single'
                ? 'Нажмите кнопку ниже, чтобы вытянуть карту'
                : 'Нажмите кнопку ниже, чтобы вытянуть карты'}
            </p>
          ) : spreadType === 'single' ? (
            <div className={`card ${flipped[0] ? 'flipped' : ''}`}>
              <div className="card-front">
                <img
                  src={`/cards/${selectedCards[0].card.image}`}
                  alt={selectedCards[0].card.name}
                  className="card-image"
                />
              </div>
              <div className="card-name-container">
                <span className="card-name">{selectedCards[0].card.name}</span>
                {selectedCards[0].isInverted && <span className="inverted-badge">(перевернута)</span>}
              </div>
            </div>
          ) : (
            <div className="card-grid">
              {selectedCards.map((item, index) => (
                <div key={index} className={`card ${flipped[index] ? 'flipped' : ''}`}>
                  <div className="card-front">
                    <img
                      src={`/cards/${item.card.image}`}
                      alt={item.card.name}
                      className="card-image"
                    />
                  </div>
                  <div className="card-name-container">
                    <span className="card-name">{item.card.name}</span>
                    {item.isInverted && <span className="inverted-badge">(перевернута)</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={drawCards} className="draw-btn">
          {spreadType === 'single' ? 'Вытянуть карту' : 'Вытянуть карты'}
        </button>

        {showMeaning && selectedCards.length > 0 && (
          <>
            <div className={`meanings ${spreadType === 'three' ? 'meanings-grid' : ''}`}>
              {selectedCards.map((item, index) => (
                <div key={index} className="meaning">
                  <h3>
                    {spreadType === 'three' ? `${index + 1}. ` : 'Интерпретация:'}
                    {item.card.name}
                  </h3>
                  <p className="meaning-text">
                    {item.isInverted ? item.card.reverse : item.card.meaning}
                  </p>
                </div>
              ))}
            </div>
            <div className="spread-list">
              <h4>Расклад:</h4>
              <ol>
                {selectedCards.map((item, index) => (
                  <li key={index}>
                    {item.card.name}
                    {item.isInverted && ' (перевернутая)'}
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;