import styles from "./Character.module.css";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../Database/context/AuthContext";
import Popup from "../../Components/Popup";

const CharacterSelect = ({ characters, currentlySelectedChar, switchCharacter }) => {
  const { userRef } = useContext(AuthContext);
  const [hover, setHover] = useState(false);
  const[popup,setPopUp]=useState(false);
  // const [selectedSlime, setSelectedSlime] = useState(false);


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
    // setSelectedSlime(false);
    switchCharacter(e.currentTarget.getAttribute("number"));
  };

  return (
    <div className={styles.CharacterSelectRoot}>
      <div className={styles.cgridContainer}>
        <div className={styles.characterGrid}>
          {characters.map((character) => (
            <div
              className={`${styles.character} ${character.type == currentlySelectedChar.type ? styles.Selected : ""}`}
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
                  "Slime" + 1 + ".svg"
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
    
    </div>
  );
};

export default CharacterSelect;
