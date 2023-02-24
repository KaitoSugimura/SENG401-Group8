import { useEffect, useState } from "react";
import styles from "./Character.module.css";

///UPDATE SET SKIN PATHS WHEN DB IS IMPLEMENTED

const CharacterProfile = ({ character }) => {
  const [skinNo, setSkinNo] = useState(1);

  const [imagePath, setImagePath] = useState(
    "assets/GameArt/" +
      character.type +
      "Slime/" +
      character.type +
      "Slime" +
      character.skin +
      ".gif"
  );

  useEffect(() => {
    if (character) {
      setImagePath(
        "assets/GameArt/" +
          character.type +
          "Slime/" +
          character.type +
          "Slime" +
          character.skin +
          ".gif"
      );
    }
  }, [character]);

  function getStat(stat) {
    let statContents = [];
    for (let i = 0; i < 5; i++) {
      if (i < stat) {
        statContents.push(<div className={styles.stat}></div>);
      }
    }
    return statContents;
  }

  function skinOne() {
    setImagePath(
      "assets/GameArt/" +
        character.type +
        "Slime/" +
        character.type +
        "Slime" +
        character.skin +
        ".gif"
    );
    setSkinNo(1);
  }

  function skinTwo() {
    setSkinNo(2);
    if (character.two) {
      //update DB
      setImagePath(
        "assets/GameArt/" +
          character.type +
          "Slime/" +
          character.type +
          "Slime" +
          "2" +
          ".gif"
      );
    } else {
      setImagePath("assets/GameArt/Locked.png");
    }
  }

  function skinThree() {
    setSkinNo(3);
    if (character.three) {
      //update DB
      setImagePath(
        "assets/GameArt/" +
          character.type +
          "Slime/" +
          character.type +
          "Slime" +
          "3" +
          ".gif"
      );
    } else {
      setImagePath("assets/GameArt/Locked.png");
    }
  }

  return (
    <div className={styles.bottom}>
      <div className={styles.characterProfile}>
        <div className={styles.characterBox}>
          <div className={styles.selectedCharacter}>
            <img src={imagePath} alt={character.type} draggable="false" />
          </div>
          <div className={styles.statsBox}>
            <h1>{character.type} Slime</h1>
            <div className={styles.statsContainer}>
              <h2>Power:</h2>
              {getStat(character.power)}
            </div>
            <div className={styles.statsContainer}>
              <h2>Speed:</h2>
              {getStat(character.speed)}
            </div>
            <div className={styles.statsContainer}>
              <h2>Health:</h2>
              {getStat(character.health)}
            </div>
            <div className={styles.statsContainer}>
              <img
                src="assets/GameArt/Skin1.png"
                alt="skin 1"
                onClick={skinOne}
                className={skinNo == 1 ? styles.selected : ""}
              />
              <img
                src="assets/GameArt/Skin2.png"
                alt="skin 2"
                onClick={skinTwo}
                className={skinNo == 2 ? styles.selected : ""}
              />
              <img
                src="assets/GameArt/Skin3.png"
                alt="skin 3"
                onClick={skinThree}
                className={skinNo == 3 ? styles.selected : ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;
