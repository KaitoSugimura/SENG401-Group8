import styles from "./Character.module.css";
import { useState } from "react";

const CharacterSelect = ({ characters, switchCharacter }) => {
  const [hover, setHover] = useState(false);
  const imagePath = "";

  const handleClick = (e) => {
    switchCharacter(e.currentTarget.getAttribute("number"));
  };

  return (
    <div className={styles.cgridContainer}>
      <div className={styles.characterGrid}>
        {characters.map((character) => (
          <div
            className={styles.character}
            number={character.id}
            key={character.id}
            onClick={handleClick}
          >
            <img
              src={
                character.unlocked
                  ? character.image
                  : "assets/GameArt/Locked.png"
              }
              alt={character.type}
              key={character.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelect;
