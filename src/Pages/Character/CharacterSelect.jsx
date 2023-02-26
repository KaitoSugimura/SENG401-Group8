import styles from "./Character.module.css";
import { useEffect, useState } from "react";

const CharacterSelect = ({ characters, switchCharacter }) => {
  const [hover, setHover] = useState(false);
  const unlockedStyle ={
    opacity:"1.0",
    filter:"grayscale(0%)"
  }

  const lockedStyle ={
    opacity:"0.8",
    filter:"grayscale(100%)"
  } 

  const handleClick = (e) => {
    // window.confirm("Hello World!");
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
                "assets/GameArt/" + character.type+"Slime/"+character.type + "Slime.png"
              }
              style={character.unlocked?unlockedStyle:lockedStyle}
              alt={character.type}
              key={character.id}
              draggable="false"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelect;
