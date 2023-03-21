import { useContext, useEffect, useState } from "react";
import styles from "./Lobby.module.css";
import { projectDatabase } from "../../../Database/firebase/config";
import { AuthContext } from "../../../Database/context/AuthContext";
import Popup from "../../../Components/Popup.jsx";
import CreateLobby from "./CreateLobby";
import { gameContext } from "../Game";

export default function Lobby({ setGameState }) {
  const { user } = useContext(AuthContext);
  const { setServerPlayerID, setClientPlayerID } = useContext(gameContext);

  const [character, updateCharacter] = useState({
    type: "Earth", skin: 1, unlocked: true, power: 3, speed: 3, health: 3, two: false, three: true,
  })
  const [popup, setPopup]=useState(false);
  const [publicLobbyList, setPublicLobbyList] = useState({});
  const [privateLobbyList, setPrivateLobbyList] = useState({});
  const [imagePath, updateImagePath] = useState();
  const[lobbyList, setLobbyList]=useState(false);
  const[mode, setMode]=useState(true);

  let lobbyRef = projectDatabase.ref("lobby");
  let publicLobbyRef;
  let privateLobbyRef;

  useEffect(() => {
    updateImagePath(
      "assets/GameArt/" +
      character.type +
      "Slime/" +
      character.type +
      "Slime" +
      character.skin +
      ".gif")

  }, [character])

  useEffect(()=>{

  }, [popup])

  useEffect(() => {
    const publicLobbyRef = projectDatabase.ref("lobby/public");
    publicLobbyRef.on("value", (snapshot) => {
      setPublicLobbyList(snapshot.val());
    });
    const privateLobbyRef = projectDatabase.ref("lobby/private");
    privateLobbyRef.on("value", (snapshot) => {
      setPrivateLobbyList(snapshot.val());
    })
  }, []);

  const showRoomOptions = () => {
    setPopup(true);
  }

  const createPublicRoom = (goldAmount) => {
    setServerPlayerID(user.uid);

    publicLobbyRef = projectDatabase.ref(`lobby/public/${user.uid}`);
    publicLobbyRef.set({
      uid: user.uid,
      name: user.displayName,
      rank: user.data.rank,
      gold: goldAmount,
      slimePath: user.data.slimePath,
      slimeType: user.data.slimeType,
      empty: false
    });
    const clientSlot = projectDatabase.ref(`lobby/public/${user.uid}/client`);
    clientSlot.set({
      empty: true
    });
    publicLobbyRef.onDisconnect().remove();
    setGameState("Room");
  }

  const createPrivateRoom = (password, goldAmount) => {
    setServerPlayerID(user.uid);
    privateLobbyRef = projectDatabase.ref(`lobby/private/${user.uid}`);
    privateLobbyRef.set({
      uid: user.uid,
      name: user.displayName,
      rank: user.data.rank,
      gold: goldAmount,
      password: password,
      slimePath: user.data.slimePath,
      slimeType: user.data.slimeType
    });
    const clientSlot = projectDatabase.ref(`lobby/private/${user.uid}/client`);
    clientSlot.set({
      empty: true
    });
    privateLobbyRef.onDisconnect().remove();
    setGameState("Room");
  }

  const enterPublicRoom = (uid) => {
    console.log("UID:", uid);
    publicLobbyRef = projectDatabase.ref(`lobby/public/${uid}/client`);
    publicLobbyRef.set({
      uid: user.uid,
      name: user.displayName,
      rank: user.data.rank,
      slimePath: user.data.slimePath,
      slimeType: user.data.slimeType,
      empty: false
    });
    publicLobbyRef.onDisconnect().remove();
    setServerPlayerID(uid);
    setClientPlayerID(user.uid);
    setGameState("Room");
  }

  const enterPrivateRoom=(uid)=>{
    setServerPlayerID(uid);
    setClientPlayerID(user.uid);
    console.log(uid, user.uid);
    let ogpass;
    privateLobbyRef = projectDatabase.ref('lobby/private/'+uid);
    privateLobbyRef.on('value', (snapshot)=>{
      ogpass = snapshot.val().password;
      console.log(snapshot.val().password);
    }, (errorObject)=>{
      console.log("The read failed: "+errorObject.name);
    })
    let password = window.prompt("Please enter room password.");
    if(ogpass===password){
      setGameState("Room");
    }
  }


  return (
    <div className={styles.Lobbypage}>

      <div className={styles.Character}>
        <h1>{user.displayName}</h1>
        <div className={styles.characterBox}>
          <img src={user.data.slimePath+".svg"} alt={character.type} draggable="false" />
        </div>
        <h2>{character.type} Slime</h2>
        <h2>Rank: {user.data.rank}</h2>
      </div>

      <div className={styles.lobbies}>
        {lobbyList&&<div className={styles.lobbySelect}>
          {publicLobbyList && Object.values(publicLobbyList).map((OtherPerson, index) => (
            <div className={styles.lobby} key={index}>

              <div className={styles.gold}>
                <img src="assets/GameArt/Gold.png" alt="" />
              </div>
              <div className={styles.goldInfo}>
                x{OtherPerson.gold}
              </div>
              <div className={styles.lobbyDetails}>
                <h2>{OtherPerson.name}</h2>
                <h3>Rank:{OtherPerson.rank}</h3>
              </div>
              <div className={styles.selectRoomButton} onClick={() => {
                enterPublicRoom(OtherPerson.uid);
              }}>
                <img src="assets/GameArt/Door.png" alt="" />
              </div>
            </div>
          ))}
          {privateLobbyList&& Object.values(privateLobbyList).map((OtherPerson, index)=>(
             <div className={styles.lobby} key={index}>

             <div className={styles.gold}>
               <img src="assets/GameArt/Gold.png" alt="" />
             </div>
             <div className={styles.goldInfo}>
               x{OtherPerson.gold}
             </div>
             <div className={styles.lobbyDetails}>
               <h2>{OtherPerson.name}</h2>
               <h3>Rank:{OtherPerson.rank}</h3>
             </div>
             <div className={styles.selectRoomButton} onClick={(e) => {
              enterPrivateRoom(OtherPerson.uid);
             }}>
               <img src="assets/GameArt/Locked.png" alt="" />
             </div>
           </div>
          ))}




        </div>}
        {mode&& <div className={styles.createButton} onClick={()=>{
          setMode(false);
          setLobbyList(true);

        }}>
          Create/Join custom
          </div>}
        {mode&& <div className={styles.createButton} onClick={()=>{
          setGameState("Battle");
        }}>
        Play ranked
        </div>}
        {!mode&&lobbyList&&!popup && <div className={styles.lobbySelection}>
            <div className={styles.createButton} onClick={() => { showRoomOptions() }}>
            Create Lobby
           </div>
           <div className={styles.returnButton} onClick={()=>{setMode(true);
            setLobbyList(false);}}>
            <img src="assets/GameArt/RestartButton.png" alt="" /></div>
          </div>}
        

        {popup && <Popup setPopUp={setPopup}>
          <CreateLobby setPopUp={setPopup} 
          createPublicRoom={createPublicRoom} createPrivateRoom = {createPrivateRoom}>
          </CreateLobby>
        </Popup>}

      </div>

    </div>
  )
}