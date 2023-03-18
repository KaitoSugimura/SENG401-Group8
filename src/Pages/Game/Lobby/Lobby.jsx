import { useEffect, useState } from "react";
import styles from "./Lobby.module.css";
import {useAuthContext} from "../../../Database/Hooks/useAuthContext"

export default function Lobby({setGameState}) {

  const {user}= useAuthContext();

  const [character,updateCharacter]=useState({
    type: "Normal",skin:1, unlocked: true,power:3,speed:3,health:3,two:false,three:true, id: 1
  })

  const [imagePath, updateImagePath]=useState()

  useEffect(()=>{
    updateImagePath(
    "assets/GameArt/" +
    character.type +
    "Slime/" +
    character.type +
    "Slime" +
    character.skin +
    ".gif")

  }, [character])


  return (
    <div className={styles.Lobbypage}>

      <div className={styles.Character}>
        <h1>{user.displayName}</h1>
        <div className={styles.characterBox}>
            <img  src={imagePath} alt={character.type}draggable="false"/>
        </div>
        <h2>{character.type} Slime</h2>
        <h2>Rank: {user.data.rank}</h2>
      </div>

      <div className={styles.Lobbies}>
        <button onClick={() => setGameState("Room")}>Join Room</button>
      </div>
      
    </div>
  )
}
