import Player from "./Player";
import styles from "./Room.module.css";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../../Database/context/AuthContext";
import { projectDatabase } from "../../../Database/firebase/config";
import { gameStateContext } from "../gameStateContext";
import LoadingScreen from "../LoadingScreen";

export default function Room({ setGameState }) {

  const { user } = useContext(AuthContext);
  const { serverPlayerID, clientPlayerID, setClientPlayerID } =
    useContext(gameStateContext);

    const [loading, setLoading] = useState(true);

  const battleFieldWidth = useRef(48);
  const battleFieldHeight = useRef(27);

  const [self, setSelf] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const[gold,setGold]= useState(null);

  const [lockButtons, setLockButtons] = useState(false);

  let lockRef = projectDatabase.ref(`lobby/rooms/${serverPlayerID}/lock`);
  let StubLobbyRef = projectDatabase.ref(
    `battle/${serverPlayerID}/loadComplete`
  );

  useEffect(() => {
    lockRef.on("value", (otherSnapshot) => {
      setLockButtons(otherSnapshot.val());
      if (otherSnapshot.val()) {
        setTimeout(() => {
          setGameState("Battle");
        }, 500);
      }
    });
    StubLobbyRef.set({ server: false, client: false });
    StubLobbyRef.onDisconnect().remove();
    projectDatabase.ref(`lobby/rooms/${serverPlayerID}`).on("value", (snapShot)=>{
      if(!snapShot.exists()){
        lockRef.off();
        setGameState("Lobby");
      }
    })
  }, []);

  useEffect(() => {
    if (serverPlayerID == user.uid) {
      const selfRef = projectDatabase.ref(`lobby/rooms/${user.uid}`);
      selfRef.once("value", (otherSnapshot) => {
        setSelf(otherSnapshot.val());
      });
      const enemyRef = projectDatabase.ref(
        `lobby/rooms/${serverPlayerID}/client`
      );
      enemyRef.on("value", (otherSnapshot) => {
        if (otherSnapshot.val() && !otherSnapshot.val().empty) {
          setClientPlayerID(otherSnapshot.val().uid);
          setEnemy(otherSnapshot.val());
        } else {
          setClientPlayerID("");
          setEnemy(null);
          // enemyRef.off();
        }
      });
      const goldRef = projectDatabase.ref( `lobby/rooms/${serverPlayerID}`);
      goldRef.on("value", (otherSnapshot)=>{
        setGold(otherSnapshot.child("gold").val());
      }, (errorObject)=>{
        console.log('The read failed: '+errorObject.name)
      });
    } else {
      const selfRef = projectDatabase.ref(
        `lobby/rooms/${serverPlayerID}/client`
      );
      selfRef.once("value", (otherSnapshot) => {
        setSelf(otherSnapshot.val());
      });
      const enemyRef = projectDatabase.ref(`lobby/rooms/${serverPlayerID}`);
      enemyRef.once("value", (otherSnapshot) => {
        setEnemy(otherSnapshot.val());
      });
      const goldRef = projectDatabase.ref( `lobby/rooms/${serverPlayerID}`);
      goldRef.on("value", (otherSnapshot)=>{
        setGold(otherSnapshot.child("gold").val());
      }, (errorObject)=>{
        console.log('The read failed: '+errorObject.name)
      });
    }
  }, []);

  useEffect(() => {
    battleFieldWidth.current = 48;
    battleFieldHeight.current = 27;
    const ratio = (window.innerHeight - 65) / window.innerWidth;
    if (ratio < 0.5625) {
      battleFieldWidth.current = battleFieldWidth.current * (ratio / 0.5625);
      battleFieldHeight.current = battleFieldWidth.current * 0.5625;
    }
  }, [window.innerWidth, window.innerHeight]);

  return (
    <div className={styles.roomPage}>
       {loading && <LoadingScreen/>}
      {self && <Player number={1} user={self}></Player>}
      <div className={styles.match}>
        <div
          className={styles.map}
          style={{
            width: battleFieldWidth.current + "vw",
            height: battleFieldHeight.current + "vw",
          }}
        >
          <img src="assets/GameMap/SlimeMeadows.webp" alt="" onLoad={()=>{
            setLoading(false);
          }}/>
        </div>
        <div className={styles.goldContainer}>
          <p className={styles.mapName}>Slime Meadows</p>
          <div className={styles.goldImage}>
            <img src="assets/GameArt/Gold.png" alt="" />
          </div>
          <p className={styles.goldText}>x{gold}</p>
        </div>
        <div className={styles.buttonContainer}>
          <div
            className={`${styles.selectionButton} ${
              lockButtons || enemy==null ||user.uid ==clientPlayerID ? styles.lockedButton : ""
            }`}
            onClick={() => {
              if (!lockButtons && serverPlayerID == user.uid && enemy) {
                lockRef.set(true);
              }
            }}
          >
            <img src="assets/GameArt/PlayButton.png" alt="" />
          </div>
          <div
            className={`${styles.selectionButton} ${
              lockButtons ? styles.lockedButton : ""
            }`}
            onClick={() => {
              if (!lockButtons) {
                lockRef.off();
                if (serverPlayerID == user.uid) {
                  projectDatabase.ref(`lobby/rooms/${user.uid}`).remove();
                } else {
                  const clientSlot = projectDatabase.ref(
                    `lobby/rooms/${serverPlayerID}/client`
                  );
                  clientSlot.set({
                    empty: true,
                  });
                }
                StubLobbyRef.remove();
                setGameState("Lobby");
              }
            }}
          >
            <img src="assets/GameArt/RestartButton.png" alt="" />
          </div>
        </div>
      </div>
      {enemy && <Player number={2} user={enemy}></Player>}
    </div>
  );
}
