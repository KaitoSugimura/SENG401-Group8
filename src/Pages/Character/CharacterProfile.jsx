import { useEffect, useState } from "react";
import styles from "./Character.module.css";

///UPDATE SET SKIN PATHS WHEN DB IS IMPLEMENTED

const CharacterProfile = ({ character }) => {
  
  const [imagePath,setImagePath]=useState(
    "assets/GameArt/" + character.type+"Slime/"+character.type + "Slime"+character.skin+".gif"
  )

  useEffect(()=>{
    if(character){
      setImagePath("assets/GameArt/" + character.type+"Slime/"+character.type + "Slime"+character.skin+".gif");
    }
  },[character])

  function getStat(stat) {
    let statContents = [];
    for (let i = 0; i < 5; i++) {
      if (i < stat) {
        statContents.push(<div className={styles.stat}></div>);
      }
    }
    return statContents;
  }

  function skinOne(){
    setImagePath("assets/GameArt/" + character.type+"Slime/"+character.type + "Slime"+character.skin+".gif");
  }

  function skinTwo(){
    if(character.two){
      //update DB
      setImagePath("assets/GameArt/" + character.type+"Slime/"+character.type + "Slime"+"2"+".gif");
    }
    else{
      setImagePath("assets/GameArt/Locked.png");
    }
  }

  function skinThree(){
    if(character.three){
      //update DB
      setImagePath("assets/GameArt/" + character.type+"Slime/"+character.type + "Slime"+"3"+".gif");
    }
    else{
      setImagePath("assets/GameArt/Locked.png");
    }
  }

  return (
    <div className={styles.bottom}>
      <div className={styles.characterProfile}>
        <div className={styles.characterBox}>
          <div className={styles.selectedCharacter}>
            <img
              src={imagePath}
              alt={character.type}
            />
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
              <img src="assets/GameArt/Skin1.png" alt="skin 1" onClick={skinOne}/>
              <img src="assets/GameArt/Skin2.png" alt="skin 2" onClick={skinTwo}/>
              <img src="assets/GameArt/Skin3.png" alt="skin 3" onClick={skinThree}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;
