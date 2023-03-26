import { useEffect, useState, useContext, useRef } from "react";
import styles from "./Character.module.css";
import { AuthContext } from "../../Database/context/AuthContext";
import { projectFirestore } from "../../Database/firebase/config";
import firebase from "firebase";
import Popup from "../../Components/Popup";

//Currecny images
import skinShard from "/assets/GameArt/SkinShard.png"
import characterShard from "/assets/GameArt/CharacterShard.png"

///UPDATE SET SKIN PATHS WHEN DB IS IMPLEMENTED

const CharacterProfile = ({ character, switchCharacter, characters, updateCharacters, updateCharacter }) => {
  const { user, userRef } = useContext(AuthContext);
  const[popup,setPopUp]=useState(false);
  const[enough,setEnough]=useState(false);
  const currencyText = useRef("character");
  const[currencyImage,setCurrencyImage]=useState(skinShard);
  const[price,setPrice]=useState();
  const [skinNo, setSkinNo] = useState(character.skin);
  const [lockedButtonStyle, setlockedButtonStyle] = useState({
    visibility: "hidden"
  })

  const unlockedStyle = {
    opacity: "1.0",
    filter: "grayscale(0%)"
  }

  const lockedStyle = {
    opacity: "0.6",
    filter: "grayscale(50%)"
  }

  const [imageStyle, setImageStyle] = useState(unlockedStyle);

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
    character.skin=1;
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
    if (character.unlocked) {
      setImageStyle(unlockedStyle)
      setlockedButtonStyle({ visibility: "hidden" })
    } else {
      setImageStyle(lockedStyle)
      setlockedButtonStyle({ visibility: "visible" })
    }
  }, [character]);

  function getStat(stat) {
    let statContents = [];
    for (let i = 0; i < 5; i++) {
      if (i < stat) {
        statContents.push(<div className={styles.stat} key={i}></div>);
      }
    }
    return statContents;
  }

  function changeSkin(num) {
    setSkinNo(num);
    
    if (character) {
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
      if(character.unlocked){
        setlockedButtonStyle({ visibility: "hidden" })
      }
      else{
        setlockedButtonStyle({ visibility: "visible" })
      }
      if (character.unlocked && num == 1) {
        setImageStyle(unlockedStyle)
      }
      else if (character.two && num == 2) {
        setImageStyle(unlockedStyle)
      }
      else if (character.three && num == 3) {
        setImageStyle(unlockedStyle)
      }
      else {
        setImageStyle(lockedStyle)
      }
    }
  }

  function handleUnlock() {
    console.log("Trying to unlock the skin")
    if (!character.unlocked) {
      //check currency is enough
      
      character.unlocked = true;
      
      //updated database
      switchCharacter(character.id);
      if (skinNo == 1) {
        setImageStyle(unlockedStyle);
        setlockedButtonStyle({ visibility: "hidden" })
      }
      else {
        changeSkin(1);
      }
      let newCharShard = user.data.characterShard - price;
      userRef.update({
        slimes: firebase.firestore.FieldValue.arrayUnion(character.type+1),
        characterShard: newCharShard,
      })
    }
    else {
      //check currency is enough
      if (skinNo == 2) {
        character.two = true;
      }
      else if (skinNo == 3) {
        character.three = true;
      }
      setImageStyle(unlockedStyle)
      setlockedButtonStyle({ visibility: "hidden" })
      console.log(price);
      let newSkinShard = user.data.skinShard - price;
      userRef.update({
        slimes: firebase.firestore.FieldValue.arrayUnion(character.type+skinNo),
        skinShard: newSkinShard,
      })
    }
  }

  const handleUnlockRequest=()=>{
    let price;
    let char;
    if(!character.unlocked){
      price = character.price;
      char = true;
      currencyText.current = "character";
      setCurrencyImage(characterShard);
    }
    else if(skinNo==2){
      price=1.5*character.price;
      char = false;
      currencyText.current = "skin";
      setCurrencyImage(skinShard);
    }
    else if(skinNo==3){
      price = 2*character.price;
      char = false;
      currencyText.current = "skin";
      setCurrencyImage(skinShard);
    }
    if(char&&user.data.characterShard>=price){
      setEnough(true);
    }
    else if(!char&&user.data.skinShard>=price){
      setEnough(true);
    }
    else{
      setEnough(false);
    }
    setPopUp(true);
    setPrice(price);    
  }

  return (
    <div className={styles.bottom}>
      <div className={styles.currency}>
        <img  src={characterShard} alt="" /> x{user.data.characterShard}
        <img className={styles.skinShard} src={skinShard} alt="" />  x{user.data.skinShard}
      </div>
      <div className={styles.characterProfile}>
        <div className={styles.characterBox}>
          <div className={styles.selectedCharacter}>
            <img style={imageStyle} src={imagePath} alt={character.type} draggable="false" />
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
                onClick={() => { changeSkin(1) }}
                className={character.skin == 1 ? styles.selected : ""}
              />
              <img
                src="assets/GameArt/Skin2.png"
                alt="skin 2"
                onClick={() => { changeSkin(2) }}
                className={character.skin == 2 ? styles.selected : ""}
              />
              <img
                src="assets/GameArt/Skin3.png"
                alt="skin 3"
                onClick={() => { changeSkin(3) }}
                className={character.skin == 3 ? styles.selected : ""}
              />
            </div>
            <div style={lockedButtonStyle} className={styles.unlockButton} onClick={handleUnlockRequest}>
              <img src="assets/GameArt/Locked.png" alt="Lockbutton" />
            </div>
          </div>
        </div>
      </div>
      {popup&&<Popup setPopUp={setPopUp}>
        <div className={styles.unlockConfirm}>
          <p>
            {enough?`Unlock ${currencyText.current} for ${price}`:`Need ${price}`}
          </p>
          <div className={styles.currencyContainer}>
            <img src={currencyImage} alt=""/>  
          </div>                  
          {enough && <button onClick={()=>{handleUnlock();setPopUp(false);}}>Confirm</button>}
        </div>
      </Popup>}
    </div>
  );
};

export default CharacterProfile;
