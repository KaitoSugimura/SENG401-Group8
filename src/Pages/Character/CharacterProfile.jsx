import { useEffect, useState } from "react";
import styles from "./Character.module.css";

///UPDATE SET SKIN PATHS WHEN DB IS IMPLEMENTED

const CharacterProfile = ({ character, switchCharacter, characters, updateCharacters, updateCharacter}) => {
  const [skinNo, setSkinNo] = useState(character.skin);
  const[lockedButtonStyle, setlockedButtonStyle] = useState({
    visibility: "hidden"
  })

  const unlockedStyle ={
    opacity:"1.0",
    filter:"grayscale(0%)"
  }

  const lockedStyle ={
    opacity:"0.6",
    filter:"grayscale(50%)"
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

  function changeSkin(num){
    setSkinNo(num);
    if(character){
      //update DB
      setImagePath(
        "assets/GameArt/" +
          character.type +
          "Slime/" +
          character.type +
          "Slime" +
          num.toString() +
          ".gif"
      );
      characters[character.id - 1].skin = num;
      updateCharacters(characters);
      updateCharacter(character);
      if(character.unlocked&&num==1){
        setImageStyle(unlockedStyle)
        setlockedButtonStyle({visibility:"hidden"})
      }
      else if(character.two&&num==2){
        setImageStyle(unlockedStyle)
        setlockedButtonStyle({visibility:"hidden"})
      }
      else if(character.three&&num==3){
        setImageStyle(unlockedStyle)
        setlockedButtonStyle({visibility:"hidden"})
      }
      else{
        setImageStyle(lockedStyle)
        setlockedButtonStyle({visibility:"visible"})
      }
    }
  }

  function handleUnlock(){
    if(!character.unlocked){
      //check currency is enough
      if(!window.confirm("Unlock character for 2000 points?")){
        return;
      }
      character.unlocked = true;
      //updated database
      switchCharacter(character.id);
      if(skinNo==1){
        setImageStyle(unlockedStyle);
        setlockedButtonStyle({visibility: "hidden"})
      }
      else{
        changeSkin(1);
      }
    }
    else{
      //check currency is enough
      if(!window.confirm("Unlock skin for 1000 points?")){
        return;
      }
      if(skinNo==2){
        character.two = true;
      }
      else if(skinNo==3){
        character.three = true;
      }
      setImageStyle(unlockedStyle)
      setlockedButtonStyle({visibility: "hidden"})
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
                onClick={()=>{changeSkin(1)}}
                className={character.skin == 1 ? styles.selected : ""}
              />
              <img
                src="assets/GameArt/Skin2.png"
                alt="skin 2"
                onClick={()=>{changeSkin(2)}}
                className={character.skin == 2 ? styles.selected : ""}
              />
              <img
                src="assets/GameArt/Skin3.png"
                alt="skin 3"
                onClick={()=>{changeSkin(3)}}
                className={character.skin == 3 ? styles.selected : ""}
              />
            </div>
            <div style ={lockedButtonStyle}className={styles.unlockButton} onClick={handleUnlock}>
              <img src="assets/GameArt/Locked.png" alt="Lockbutton"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;
