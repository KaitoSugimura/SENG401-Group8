import { useEffect, useState } from "react";
import styles from "./Character.module.css";

///UPDATE SET SKIN PATHS WHEN DB IS IMPLEMENTED

const CharacterProfile = ({ character}) => {
  const [skinNo, setSkinNo] = useState(1);
  const[lockedButtonStyle, setlockedButtonStyle] = useState({
    visibility: "hidden"
  })

  const unlockedStyle ={
    opacity:"1.0",
    filter:"grayscale(0%)"
  }

  const lockedStyle ={
    opacity:"0.6",
    filter:"grayscale(0%)"
  }

  const[imageStyle, setImageStyle]= useState(unlockedStyle);

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
    setSkinNo(1);
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
    if(character.unlocked){
      setImageStyle(unlockedStyle)
      setlockedButtonStyle({visibility:"hidden"})
    }else{
      setImageStyle(lockedStyle)
      setlockedButtonStyle({visibility:"visible"})
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
    setSkinNo(1);
    if (character) {
      //update DB
      setImagePath(
        "assets/GameArt/" +
          character.type +
          "Slime/" +
          character.type +
          "Slime" +
          "1" +
          ".gif"
      );
    }
    if(character.unlocked){
      setImageStyle(unlockedStyle)
      setlockedButtonStyle({visibility:"hidden"})
    }else{
      setImageStyle(lockedStyle)
      setlockedButtonStyle({visibility:"visible"})
    }
  }

  function skinTwo() {
    setSkinNo(2);
    if (character) {
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
    }
    if(character.two){
      setImageStyle(unlockedStyle)
      setlockedButtonStyle({visibility:"hidden"})
    }else{
      setImageStyle(lockedStyle)
      setlockedButtonStyle({visibility:"visible"})
    }
  }

  function skinThree() {
    setSkinNo(3);
    if (character) {
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
    }
    if(character.three){
      setImageStyle(unlockedStyle)
      setlockedButtonStyle({visibility:"hidden"})
    }else{
      setImageStyle(lockedStyle)
      setlockedButtonStyle({visibility:"visible"})
    }
  }

  return (
    <div className={styles.bottom}>
      <div className={styles.characterProfile}>
        <div className={styles.characterBox}>
          <div className={styles.selectedCharacter}>
            <img style={imageStyle} src={imagePath} alt={character.type}draggable="false"/>
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
            <div style ={lockedButtonStyle}className={styles.unlockButton}>
              <img src="assets/GameArt/Locked.png" alt="Lockbutton" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;
