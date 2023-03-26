import { useContext, useEffect, useState } from "react";
import styles from "./Lobby.module.css";
import { projectDatabase } from "../../../Database/firebase/config";
import { AuthContext } from "../../../Database/context/AuthContext";
import Popup from "../../../Components/Popup.jsx";
import CreateLobby from "./CreateLobby";
import { gameStateContext } from "../gameStateContext";

export default function Lobby({ setGameState }) {
  const { user } = useContext(AuthContext);
  const { setServerPlayerID, setClientPlayerID } = useContext(gameStateContext);

  const [popup, setPopup] = useState(false);
  const [roomList, setRoomList] = useState({});
  const [lobbyList, setLobbyList] = useState(false);
  const [mode, setMode] = useState(true);

  useEffect(() => {
    const LobbyRoomsRef = projectDatabase.ref("lobby/rooms");
    LobbyRoomsRef.on("value", (snapshot) => {
      setRoomList(snapshot.val());
    });
  }, []);

  const showRoomOptions = () => {
    setPopup(true);
  };

  const createRoom = (password, goldAmount) => {
    if (user.data.gold < goldAmount) {
      window.alert("Insufficient amount of gold");
      return;
    }
    setServerPlayerID(user.uid);

    const LobbyRef = projectDatabase.ref(`lobby/rooms/${user.uid}`);
    LobbyRef.onDisconnect().remove();
    LobbyRef.set({
      uid: user.uid,
      name: user.displayName,
      rank: user.data.rankPoints,
      gold: goldAmount,
      password: password,
      slimePath: user.data.slimePath,
      slimeType: user.data.slimeType,
    });
    const lockSlot = projectDatabase.ref(`lobby/rooms/${user.uid}/lock`);
    lockSlot.set(false);
    setGameState("Room");
  };

  const enterRoom = async (uid, goldAmount) => {
    if (user.data.gold < goldAmount) {
      window.alert("Insufficient amount of gold");
      return;
    }

    setServerPlayerID(uid);
    setClientPlayerID(user.uid);
    const openRef = projectDatabase.ref(`lobby/rooms/${uid}/client`);
    let isEmpty;
    await openRef.once("value", (snapshot) => {
      isEmpty = snapshot.val() == null;
    });
    if (!isEmpty) {
      window.alert("Room is full");
      return;
    }
    let ogpass;
    const roomRef = projectDatabase.ref(`lobby/rooms/${uid}`);
    await roomRef.once("value", (snapshot) => {
      ogpass = snapshot.val().password;
    });
    if (ogpass != "") {
      let password = window.prompt("Please enter room password.");
      if (ogpass !== password) {
        return;
      }
    }
    const clientSlotRef = projectDatabase.ref(`lobby/rooms/${uid}/client`);
    clientSlotRef.set({
      uid: user.uid,
      name: user.displayName,
      rank: user.data.rankPoints,
      slimePath: user.data.slimePath,
      slimeType: user.data.slimeType,
    });
    clientSlotRef.onDisconnect().remove();
    setGameState("Room");
  };

  const queueRanked = () => {
    setGameState("Queue");
  };

  return (
    <div className={styles.Lobbypage}>
      <div className={styles.Character}>
        <h1>{user.displayName}</h1>
        <div className={styles.characterBox}>
          <img
            src={user.data.slimePath + ".gif"}
            alt={user.data.slimeType}
            draggable="false"
          />
        </div>
        <h2>{user.data.slimeType} Slime</h2>
        <h3>Rank Points: {user.data.rankPoints}</h3>
      </div>

      <div className={styles.lobbies}>
        {lobbyList && (
          <div className={styles.lobbySelect}>
            {roomList &&
              Object.values(roomList).map(
                (OtherPerson, index) =>
                  OtherPerson && (
                    <div
                      className={styles.lobby}
                      key={index}
                      onClick={() => {
                        enterRoom(OtherPerson.uid, OtherPerson.gold);
                      }}
                    >
                      <div className={styles.gold}>
                        <img src="assets/GameArt/Gold.png" alt="" />
                      </div>
                      <div className={styles.goldInfo}>x{OtherPerson.gold}</div>
                      <div className={styles.lobbyDetails}>
                        <h2>{OtherPerson.name}</h2>
                        <h3>Rank:{OtherPerson.rank}</h3>
                      </div>
                      <div className={styles.selectRoomButton}>
                        <img
                          src={
                            OtherPerson.password === ""
                              ? "assets/GameArt/Door.png"
                              : "assets/GameArt/Locked.png"
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  )
              )}
            {!roomList && (
              <p className={styles.noRoomsText}>No rooms to display</p>
            )}
          </div>
        )}
        {mode && (
          <button
            className={styles.createButton}
            onClick={() => {
              setMode(false);
              setLobbyList(true);
            }}
          >
            Custom{" "}
          </button>
        )}
        {mode && (
          <button
            className={styles.createButton}
            onClick={() => {
              queueRanked();
            }}
          >
            Ranked
          </button>
        )}
        {!mode && lobbyList && (
          <div className={styles.lobbySelection}>
            <button
              className={`${styles.createButton} ${styles.createLobbyButton}`}
              onClick={() => {
                showRoomOptions();
              }}
            >
              Create Lobby
            </button>
            <div
              className={styles.returnButton}
              onClick={() => {
                setMode(true);
                setLobbyList(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
            </div>
          </div>
        )}

        {popup && (
          <Popup setPopUp={setPopup}>
            <CreateLobby
              setPopUp={setPopup}
              createRoom={createRoom}
            ></CreateLobby>
          </Popup>
        )}
      </div>
    </div>
  );
}
