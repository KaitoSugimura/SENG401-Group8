import styles from "./Character.module.css";
import { useEffect, useState } from "react";
import { useCharacterAndThemeContext } from "../../Database/Hooks/useCharacterAndThemeContext";

const CharacterSelect = ({ characters, currentlySelectedChar, switchCharacter }) => {
  const [hover, setHover] = useState(false);
  const { setSlimeTypeAndSkin } = useCharacterAndThemeContext();
  const unlockedStyle = {
    opacity: "1.0",
    filter: "grayscale(0%)",
  };

  const lockedStyle = {
    opacity: "0.8",
    filter: "grayscale(100%)",
  };

  const handleClick = (e) => {
    // window.confirm("Hello World!");
    switchCharacter(e.currentTarget.getAttribute("number"));
  };

  return (
    <div className={styles.CharacterSelectRoot}>
      <div className={styles.cgridContainer}>
        <div className={styles.characterGrid}>
          {characters.map((character) => (
            <div
              className={`${styles.character} ${character.type == currentlySelectedChar.type? styles.Selected : ""}`}
              number={character.id}
              key={character.id}
              onClick={handleClick}
            >
              <img
                src={
                  "assets/GameArt/" +
                  character.type +
                  "Slime/" +
                  character.type +
                  "Slime.svg"
                }
                style={character.unlocked ? unlockedStyle : lockedStyle}
                alt={character.type}
                key={character.id}
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.selectionButtonContainer}>
        <button
          className={styles.selectionButton}
          onClick={() => {
            if(currentlySelectedChar.unlocked){
              setSlimeTypeAndSkin(currentlySelectedChar.type, currentlySelectedChar.skin);
            }
          }}
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default CharacterSelect;
