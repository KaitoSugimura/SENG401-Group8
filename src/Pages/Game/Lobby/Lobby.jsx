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

  let lobbyRef = projectDatabase.ref("lobby");
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
      rank: user.data.rank
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

      <div className={styles.lobbies}>
        <div className={styles.lobbySelect}>
          {publicLobbyList && Object.values(publicLobbyList).map((OtherPerson)=>(
            <div className={styles.lobby}>
              <div className={styles.lobbyDetails}>
                <h2>{OtherPerson.name}</h2>
                <h2>Rank:{OtherPerson.rank}</h2>
              </div>
              <div className={styles.gold} onClick={() => setGameState("Room")}>
                <img src="assets/GameArt/Gold.png" alt="" />
              </div>
              <div className={styles.goldInfo}>
                x{user.data.gold}
              </div>
              <div className={styles.selectRoomButton} onClick={() => setGameState("Room")}>
                <img src="assets/GameArt/Locked.png" alt="" />
              </div>
            </div>
          ))}

        <div className={styles.lobby}>
          <div className={styles.lobbyDetails}>
            <h2>Fake Name</h2>
            <h2>Rank:0</h2>
          </div>
          <div className={styles.gold} onClick={() => setGameState("Room")}>
            <img src="assets/GameArt/Gold.png" alt="" />
          </div>
          <div className={styles.goldInfo}>
            x0
          </div>
          <div className={styles.selectRoomButton} onClick={() => setGameState("Room")}>
            <img src="assets/GameArt/Locked.png" alt="" />
          </div>
        </div>

          {/* TEMP PLEASE DELETE */}
          
          
        </div>
        <div className={styles.createButton} onClick={()=>{createPublicRoom()}}>
          Create Lobby
        </div>
        
      </div>
      
    </div>
  )
}