import {React, useState} from "react";
import CharacterSelect from './CharacterSelect';
import  styles from "./Character.module.css";
import CharacterProfile from "./CharacterProfile";

export default function Character() {

  const [characters, updateCharacters] = useState([
    {type: "Normal", image:"assets/GameArt/Slime.png", unlocked: true,power:3,speed:3,health:3, id: 1},
    {type: "Fire", image:"assets/GameArt/FireSlime.png", unlocked: true,power:5,speed:3,health:3, id: 2},
    {type: "Ice", image:"assets/GameArt/IceSlime.png", unlocked: true,power:3,speed:3,health:3, id: 3},
    {type: "Earth", image:"assets/GameArt/EarthSlime.png", unlocked: true,power:3,speed:3,health:3, id: 4},
    {type: "Air", image:"assets/GameArt/AirSlime.png", unlocked: true,power:3,speed:3,health:3, id: 5},
    {type: "Shadow", image:"assets/GameArt/ShadowSlime.png", unlocked: true,power:3,speed:3,health:3, id: 6},
    {type: "Poison", image:"assets/GameArt/PoisonSlime.png", unlocked: true,power:3,speed:3,health:3, id: 7},
    {type: "Electric", image:"assets/GameArt/ElectricSlime.png", unlocked: true,power:3,speed:3,health:3, id: 8},
    {type: "Jungle", image:"assets/GameArt/Slime.png", unlocked: false,power:3,speed:3,health:3, id: 9},
    {type: "Water", image:"assets/GameArt/Slime.png", unlocked: false,power:3,speed:3,health:3, id: 10},
    {type: "Armored", image:"assets/GameArt/ArmoredSlime.png", unlocked: true,power:3,speed:3,health:3, id: 11},
    {type: "Jello", image:"assets/GameArt/Slime.png", unlocked: false,power:3,speed:3,health:3, id: 12},

        
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
