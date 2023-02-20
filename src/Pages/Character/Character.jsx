import {React, useState} from "react";
import CharacterSelect from './CharacterSelect';
import  styles from "./Character.module.css";
import CharacterProfile from "./CharacterProfile";

export default function Character() {

  const [characters, updateCharacters] = useState([
    {type: "Normal", unlocked: true,power:3,speed:3,health:3, id: 1},
    {type: "Fire", unlocked: true,power:5,speed:3,health:3, id: 2},
    {type: "Ice", unlocked: true,power:3,speed:3,health:3, id: 3},
    {type: "Earth", unlocked: true,power:3,speed:3,health:3, id: 4},
    {type: "Air", unlocked: true,power:3,speed:3,health:3, id: 5},
    {type: "Shadow", unlocked: true,power:3,speed:3,health:3, id: 6},
    {type: "Poison", unlocked: true,power:3,speed:3,health:3, id: 7},
    {type: "Electric", unlocked: true,power:3,speed:3,health:3, id: 8},
    {type: "Jungle", unlocked: false,power:3,speed:3,health:3, id: 9},
    {type: "Water", unlocked: false,power:3,speed:3,health:3, id: 10},
    {type: "Armored", unlocked: true,power:3,speed:3,health:3, id: 11},
    {type: "Jello", unlocked: false,power:3,speed:3,health:3, id: 12},

        
  ])

  const [character, updateCharacter] = useState(
    {type:"Normal", image:"assets/GameArt/Slime.png", power:3,speed:3,health:3,}
  )

  const switchCharacter = (id)=>{
    let newCharacter;
    for (let i = 0; i < characters.length; i++) {
      if(characters[i].id == id){
        if(characters[i].unlocked){
          updateCharacter(characters[i]);
        }
        break;
      }
    }
  }

  return (
    <div className={styles.characterPage}>
      {character &&<CharacterProfile character = {character}/>}
      {characters && <CharacterSelect characters = {characters} switchCharacter = {switchCharacter}/>}
         
    </div>
  )
}
