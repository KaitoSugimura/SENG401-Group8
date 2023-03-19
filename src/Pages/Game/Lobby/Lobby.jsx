import { useEffect, useState } from "react";
import styles from "./Lobby.module.css";
import {useAuthContext} from "../../../Database/Hooks/useAuthContext"

export default function Lobby({setGameState}) {

  const {user}= useAuthContext();

  const [character,updateCharacter]=useState({
    type: "Earth",skin:1, unlocked: true,power:3,speed:3,health:3,two:false,three:true, 
  })

  const [lobbyList, updateLobbies]=useState([
    {name:"Lobby1", ownerID: 1234, ownerName: "MisterMan", ownerRank:2, private:true, password:1234, gold:1234, id:1},
    {name:"Lobby2", ownerID: 1234, ownerName: "MisterMan", ownerRank:2, private:true, password:1234, gold:1234, id:2},
    {name:"Lobby3", ownerID: 1234, ownerName: "MisterMan", ownerRank:2, private:true, password:1234, gold:1234, id:3},
    {name:"Lobby4", ownerID: 1234, ownerName: "MisterMan", ownerRank:2, private:false, password:null, gold:1234, id:4},
    {name:"Lobby5", ownerID: 1234, ownerName: "MisterMan", ownerRank:2, private:false, password:null, gold:1234, id:5},
    {name:"Lobby6", ownerID: 1234, ownerName: "MisterMan", ownerRank:2, private:false, password:null, gold:1234, id:6},
    {name:"Lobby7", ownerID: 1234, ownerName: "MisterMan", ownerRank:2, private:false, password:null, gold:1234, id:7},
    {name:"Lobby8", ownerID: 1234, ownerName: "MisterMan", ownerRank:2, private:false, password:null, gold:1234, id:8},
    {name:"Lobby9", ownerID: 1234, ownerName: "MisterMan", ownerRank:2, private:true, password:1234, gold:1234, id:9},
    {name:"Lobby10", ownerID: 1234, ownerName: "MisterMan", ownerRank:2, private:true, password:1234, gold:1234, id:10}
  ])

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
        <div className={styles.lobbySelect}>
          {lobbyList.map((lobby)=>(
            <div>
              <button onClick={() => setGameState("Room")}>Join Room</button>
            </div>
          ))}
          
        </div>
        
      </div>
      
    </div>
  )
}
