import Player from "./Player";
import styles from "./Room.module.css";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../../Database/context/AuthContext";
import { gameContext } from "../Game";
import { projectDatabase } from "../../../Database/firebase/config";

export default function Room({ setGameState }) {
  const { user } = useContext(AuthContext);
  const { serverPlayerID, clientPlayerID, setClientPlayerID } =
    useContext(gameContext);

  const battleFieldWidth = useRef(35);
  const battleFieldHeight = useRef(19.6875);

  const [self, setSelf] = useState(null);
  const [enemy, setEnemy] = useState(null);

  useEffect(() => {
    if (serverPlayerID == user.uid) {
      const selfRef = projectDatabase.ref(`lobby/public/${user.uid}`);
      selfRef.once("value", (otherSnapshot) => {
        setSelf(otherSnapshot.val());
      });
      const enemyRef = projectDatabase.ref(
        `lobby/public/${serverPlayerID}/client`
      );
      enemyRef.on("value", (otherSnapshot) => {
        if (!otherSnapshot.val().empty) {
          setClientPlayerID(otherSnapshot.val().uid);
          setEnemy(otherSnapshot.val());
        } else {
          setClientPlayerID("");
          setEnemy(null);
        }
      });
    } else {
      const selfRef = projectDatabase.ref(
        `lobby/public/${serverPlayerID}/client`
      );
      selfRef.once("value", (otherSnapshot) => {
        setSelf(otherSnapshot.val());
      });
      const enemyRef = projectDatabase.ref(`lobby/public/${serverPlayerID}`);
      enemyRef.once("value", (otherSnapshot) => {
        setEnemy(otherSnapshot.val());
      });
    }
  }, []);

  useEffect(() => {
    battleFieldWidth.current = 35;
    battleFieldHeight.current = 19.6875;
    const ratio = (window.innerHeight - 65) / window.innerWidth;
    if (ratio < 0.5625) {
      battleFieldWidth.current = battleFieldWidth.current * (ratio / 0.5625);
      battleFieldHeight.current = battleFieldWidth.current * 0.5625;
    }
  }, [window.innerWidth, window.innerHeight]);

  return (
    <div className={styles.roomPage}>
      {self && <Player number={1} user={self}></Player>}
      <div className={styles.match}>
        <div
          className={styles.map}
          style={{
            width: battleFieldWidth.current + "vw",
            height: battleFieldHeight.current + "vw",
          }}
        >
          <img src="assets/GameMap/SlimeMeadows.webp" alt="" />
        </div>
        <div className={styles.goldContainer}>
          <p className={styles.mapName}>Slime Meadows</p>
          <div className={styles.goldImage}>
            <img src="assets/GameArt/Gold.png" alt="" />
          </div>
          <p className={styles.goldText}>x{user.data.gold}</p>
        </div>
        <div className={styles.buttonContainer}>
          <div
            className={styles.selectionButton}
            onClick={() => setGameState("Battle")}
          >
            <img src="assets/GameArt/PlayButton.png" alt="" />
          </div>
          <div
            className={styles.selectionButton}
            onClick={() => {
              const clientSlot = projectDatabase.ref(
                `lobby/public/${serverPlayerID}/client`
              );
              clientSlot.set({
                empty: true,
              });
              setGameState("Lobby");
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
