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

  const [popup, setPopup]=useState(false);
  const [roomList, setRoomList] = useState({});
  const[lobbyList, setLobbyList]=useState(false);
  const[mode, setMode]=useState(true);

  useEffect(() => {
    const LobbyRoomsRef = projectDatabase.ref("lobby/rooms");
    LobbyRoomsRef.on("value", (snapshot) => {
      setRoomList(snapshot.val());
    });
  }, []);

  const showRoomOptions = () => {
    setPopup(true);
  }

  const createRoom = (password, goldAmount) => {
    setServerPlayerID(user.uid);

    const LobbyRef = projectDatabase.ref(`lobby/rooms/${user.uid}`);
    LobbyRef.onDisconnect().remove();
    LobbyRef.set({
      uid: user.uid,
      name: user.displayName,
      rank: user.data.rank,
      gold: goldAmount,
      password: password,
      slimePath: user.data.slimePath,
      slimeType: user.data.slimeType,
      empty: true
    });
    const clientSlot = projectDatabase.ref(`lobby/rooms/${user.uid}/client`);
    clientSlot.set({
      empty: true
    });
    const lockSlot = projectDatabase.ref(`lobby/rooms/${user.uid}/lock`);
    lockSlot.set(false);
    setGameState("Room");
  }

  const enterRoom = (uid) => {
    setServerPlayerID(uid);
    setClientPlayerID(user.uid);
    let ogpass;
    let isOpen;
    const roomRef = projectDatabase.ref(`lobby/rooms/${uid}`);
    roomRef.once('value', (snapshot)=>{
      ogpass = snapshot.val().password;
      isOpen = snapshot.val().empty;
    })
    if(!isOpen){
      return; 
    }
    if(ogpass != ""){
      let password = window.prompt("Please enter room password.");
      if(ogpass!==password){
        return;
      }
    } 
    const clientSlotRef = projectDatabase.ref(`lobby/rooms/${uid}/client`);
    clientSlotRef.set({
      uid: user.uid,
      name: user.displayName,
      rank: user.data.rank,
      slimePath: user.data.slimePath,
      slimeType: user.data.slimeType,
      empty: false
    });
    clientSlotRef.onDisconnect().set({
      empty: true
    });
    setGameState("Room");
  }



  return (
    <div className={styles.Lobbypage}>

      <div className={styles.Character}>
        <h1>{user.displayName}</h1>
        <div className={styles.characterBox}>
          <img src={user.data.slimePath+".gif"} alt={user.data.slimeType} draggable="false" />
        </div>
        <h2>{user.data.slimeType} Slime</h2>
        <h2>Rank: {user.data.rank}</h2>
      </div>

      <div className={styles.lobbies}>
        {lobbyList&&<div className={styles.lobbySelect}>
          {roomList && Object.values(roomList).map((OtherPerson, index) => (
            OtherPerson.empty && <div className={styles.lobby} key={index}>

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
                enterRoom(OtherPerson.uid);
              }}>
                <img src={OtherPerson.password===""?"assets/GameArt/Door.png":"assets/GameArt/Locked.png"} alt="" />
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
          createRoom={createRoom} >
          </CreateLobby>
        </Popup>}

      </div>

    </div>
  )
}