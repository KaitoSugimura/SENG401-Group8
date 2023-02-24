import {React, useState} from "react";
import CharacterSelect from './CharacterSelect';
import  styles from "./Character.module.css";
import CharacterProfile from "./CharacterProfile";

export default function Character() {

  const [characters, updateCharacters] = useState([
    {type: "Normal",skin:1, unlocked: true,power:3,speed:3,health:3,two:true,three:true, id: 1},
    {type: "Fire",skin:1, unlocked: true,power:5,speed:3,health:3,two:true,three:true, id: 2},
    {type: "Ice",skin:1, unlocked: true,power:3,speed:3,health:3,two:true,three:true, id: 3},
    {type: "Earth",skin:1, unlocked: true,power:3,speed:3,health:3,two:true,three:true, id: 4},
    {type: "Air",skin:1, unlocked: true,power:3,speed:3,health:3,two:true,three:true, id: 5},
    {type: "Poison",skin:1, unlocked: true,power:3,speed:3,health:3,two:true,three:true, id: 6},
    {type: "Shadow",skin:1, unlocked: true,power:3,speed:3,health:3,two:false,three:false, id: 7},
    {type: "Electric",skin:1, unlocked: true,power:3,speed:3,health:3,two:false,three:false, id: 8},
    {type: "Wild",skin:1, unlocked: true,power:3,speed:3,health:3,two:false,three:false, id: 9},
    {type: "Honey",skin:1, unlocked: true,power:3,speed:3,health:3,two:false,three:false, id: 10},
    {type: "BubbleGum",skin:1, unlocked: true,power:3,speed:3,health:3,two:false,three:false, id: 11},
    {type: "Armored",skin:1, unlocked: true,power:3,speed:3,health:3,two:false,three:false, id: 12},
    {type: "Celestial",skin:1, unlocked: true,power:3,speed:3,health:3,two:false,three:false, id: 13},
    {type: "Metal",skin:1, unlocked: true,power:3,speed:3,health:3,two:false,three:false, id: 14},

        
  ])

  const [character, updateCharacter] = useState(
    characters[0]
  )

  const switchCharacter = (id)=>{
    for (let i = 0; i < characters.length; i++) {
      if(characters[i].id == id){
        if(characters[i].unlocked){
          //UPDATE DB
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
