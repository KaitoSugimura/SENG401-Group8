import { React, useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Database/context/AuthContext";
import CharacterSelect from './CharacterSelect';
import styles from "./Character.module.css";
import CharacterProfile from "./CharacterProfile";
import { projectAuth, projectFirestore } from "../../Database/firebase/config";

export default function Character() {

  const { user, userRef } = useContext(AuthContext);
  const [userCharacters, updateUserCharacters] = useState([]);
  const [characters, updateCharacters] = useState([
    { type: "Normal", skin: 1, unlocked: true, power: 3, speed: 3, health: 3, two: false, three: false, price: 450,id: 1 },
    { type: "Fire", skin: 1, unlocked: false, power: 5, speed: 3, health: 1, two: false, three: false, price: 450,id: 2 },
    { type: "Ice", skin: 1, unlocked: false, power: 4, speed: 2, health: 3, two: false, three: false, price: 450,id: 3 },
    { type: "Earth", skin: 1, unlocked: false, power: 4, speed: 1, health: 4, two: false, three: false, price: 450,id: 4 },
    { type: "Air", skin: 1, unlocked: false, power: 3, speed: 5, health: 1, two: false, three: false, price: 450,id: 5 },
    { type: "Electric", skin: 1, unlocked: false, power: 3, speed: 4, health: 2, two: false, three: false, price: 450,id: 6 },
    { type: "Honey", skin: 1, unlocked: false, power: 3, speed: 2, health: 4, two: false, three: false, price: 900,id: 7 },
    { type: "Poison", skin: 1, unlocked: false, power: 5, speed: 2, health: 2, two: false, three: false, price: 900,id: 8 },
    { type: "Wild", skin: 1, unlocked: false, power: 4, speed: 3, health: 2, two: false, three: false, price: 900,id: 9 },
    { type: "Shadow", skin: 1, unlocked: false, power: 3, speed: 4, health: 2, two: false, three: false, price: 900,id: 10 },
    { type: "BubbleGum", skin: 1, unlocked: false, power: 2, speed: 2, health: 5, two: false, three: false, price: 900,id: 11 },
    { type: "Armored", skin: 1, unlocked: false, power: 3, speed: 1, health: 5, two: false, three: false, price: 900,id: 12 },
    { type: "Celestial", skin: 1, unlocked: false, power: 4, speed: 4, health: 1, two: false, three: false, price: 1800,id: 13 },
    { type: "Metal", skin: 1, unlocked: false, power: 3, speed: 3, health: 3, two: false, three: false, price: 1800,id: 14 },
  ])

  const [character, updateCharacter] = useState(
    characters[0]
  )

  //fetch user slimes
  useEffect(()=>{
    //console.log("Getting the slimes!")
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
      {character && <CharacterProfile character={character} switchCharacter={switchCharacter} characters={characters} updateCharacters={updateCharacters} updateCharacter={updateCharacter} />}
      {characters && <CharacterSelect characters={characters} currentlySelectedChar={character} switchCharacter={switchCharacter} updateCharacters={updateCharacter}/>}

    </div>
  )
}
