import { useEffect, useState } from "react";
import styles from "./Lobby.module.css";
import {useAuthContext} from "../../../Database/Hooks/useAuthContext"
import { projectDatabase } from "../../../Database/firebase/config";

export default function Lobby({setGameState}) {

  const {user}= useAuthContext();
  const [character,updateCharacter]=useState({
    type: "Earth",skin:1, unlocked: true,power:3,speed:3,health:3,two:false,three:true, 
  })

  const [publicLobbyList, setPublicLobbyList] = useState({});
  const [imagePath, updateImagePath]=useState();

  let publicLobbyRef; 

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

  useEffect(() => {
    const publicLobbyRef = projectDatabase.ref("lobby/public");
    publicLobbyRef.on("value", (snapshot) => {
      setPublicLobbyList(snapshot.val());
    });
  }, []);

  const createPublicRoom = () => {
    console.log("AAAAAAAA", user.id);
    publicLobbyRef = projectDatabase.ref(`lobby/public/${user.uid}`);
    publicLobbyRef.set({
      name: user.displayName,
    });
    publicLobbyRef.onDisconnect().remove();
  }


  return (
    <div className={styles.Lobbypage}>

      <div className={styles.Character}>
        <h1>{user.displayName}</h1>
        <div className={styles.characterBox}>
            <img  src={user.data.slimePath} alt={character.type}draggable="false"/>
        </div>
        <h2>{character.type} Slime</h2>
        <h2>Rank: {user.data.rank}</h2>
      </div>

      <div className={styles.Lobbies}>
        <div className={styles.lobbySelect}>
          {publicLobbyList && Object.values(publicLobbyList).map((OtherPerson)=>(
            <div>
              <button onClick={() => setGameState("Room")}>{OtherPerson.name}</button>
            </div>
          ))}

          <div>
              <button onClick={() => setGameState("Room")}>Fake</button>
            </div>

          {/* TEMP PLEASE DELETE */}
          <button onClick={()=>{createPublicRoom()}} style={{
              position: "absolute",
              width: "50%",
              bottom: "10px",
              left: "40%",
              fontSize: "36px"
            }}>Temp Create Public Lobby Button</button>
          
        </div>
        
      </div>
      
    </div>
  )
}
