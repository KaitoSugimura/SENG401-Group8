import { React, useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Database/context/AuthContext";
import CharacterSelect from './CharacterSelect';
import styles from "./Character.module.css";
import CharacterProfile from "./CharacterProfile";
import characterData from "../../Database/JsxData/characters"

export default function Character() {

  const { user, userRef } = useContext(AuthContext);
  const [userCharacters, updateUserCharacters] = useState([]);
  let {charactersData} = characterData
  const [characters, updateCharacters] = useState(charactersData);
  // const currentlySelectedCharRef = useRef("unlocked");
  const [fadeButton, setFadeButton] = useState(false);

  const [character, updateCharacter] = useState(
    characters[0]
  )

  //fetch user slimes
  useEffect(()=>{
    const slimes = user.data.slimes;
    updateUserCharacters(slimes);
    //console.log(userCharacters);
    updateUnlocks(slimes);

  },[user.data.slimes]);

  const updateUnlocks=(slimes)=>{
    let newCharacters = characters;
    for(let i =0;i<slimes.length;i++){
      let slime=slimes[i].substring(0,slimes[i].length-1);
      let skin=Number(slimes[i].substring(slimes[i].length-1));
      let index = newCharacters.findIndex(character=>character.type===slime);
      //console.log(index+" is the index and the slime is "+newCharacters[index].type);
      if(skin===1){newCharacters[index].unlocked=true;}
      if(skin===2){newCharacters[index].two=true;}
      if(skin===3){newCharacters[index].three=true;}
    }
    updateCharacters(newCharacters);
  }

  const switchCharacter = (id) => {
    setFadeButton(false);
    for (let i = 0; i < characters.length; i++) {
      if (characters[i].id == id) {
        if (characters[i].unlocked) {
          //UPDATE DB
          updateCharacter(characters[i]);
        }
        else {
          updateCharacter(characters[i]);
        }
        break;
      }
    }
  }

  return (
    <div className={styles.characterPage}>
      {character && <CharacterProfile fadeButton={fadeButton} setFadeButton={setFadeButton} character={character} switchCharacter={switchCharacter} characters={characters} updateCharacters={updateCharacters} updateCharacter={updateCharacter} />}
      {characters && <CharacterSelect characters={characters} currentlySelectedChar={character} switchCharacter={switchCharacter} updateCharacters={updateCharacter}/>}

    </div>
  )
}