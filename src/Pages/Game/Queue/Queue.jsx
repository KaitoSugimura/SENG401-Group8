import styles from "./Queue.module.css";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../../Database/context/AuthContext";
import LoadingScreen from "../LoadingScreen";
import { projectDatabase } from "../../../Database/firebase/config";
import { gameStateContext } from "../gameStateContext";
import loadingSlime from "/assets/GameArt/LoadingSlime.gif";

/** This is literally the most simple queue ever made on this planet probably
 * Im only doing this cause we have no time :(
 */

export default function Queue({ setGameState }) {
  const { user } = useContext(AuthContext);
  const { setServerPlayerID, setClientPlayerID } = useContext(gameStateContext);

  useEffect(() => {
    const queueRanked = async () => {
      const queueRef = projectDatabase.ref(`lobby/queue`);
      let OpenRankedID = "";
      await queueRef.once("value", (snapshot) => {
        const p = snapshot.val();
        if (p) {
          for (let key in p) {
            if (p[key].open && key != user.uid) {
              OpenRankedID = key;
              break;
            }
          }
        }
      });

      if (OpenRankedID === "") {
        const newRankedRoomRef = projectDatabase.ref(`lobby/queue/${user.uid}`);
        newRankedRoomRef.set({
          uid: null,
          open: true,
        });
        newRankedRoomRef.onDisconnect().remove();
        setServerPlayerID(user.uid);
        newRankedRoomRef.on("value", (snapshot) => {
          if (snapshot.val() && snapshot.val().uid) {
            newRankedRoomRef.remove();
            setClientPlayerID(snapshot.val().uid);
            setGameState("Battle");
          }
        });
      } else {
        projectDatabase.ref(`lobby/queue/${OpenRankedID}`).set({
          uid: user.uid,
          open: false,
        });
        setServerPlayerID(OpenRankedID);
        setClientPlayerID(user.uid);
        setGameState("Battle");
      }
    };

    queueRanked();
  }, []);

  return (
    <div className={styles.roomPage}>
      <div className={styles.container}>
        <div className={styles.loadingText}>
          <span>Q</span>
          <span style={{ animationDelay: `${0.1}s` }}>U</span>
          <span style={{ animationDelay: `${0.2}s` }}>E</span>
          <span style={{ animationDelay: `${0.3}s` }}>U</span>
          <span style={{ animationDelay: `${0.4}s` }}>E</span>
          <span style={{ animationDelay: `${0.5}s` }}>I</span>
          <span style={{ animationDelay: `${0.6}s` }}>N</span>
          <span style={{ animationDelay: `${0.7}s` }}>G</span>
          <span style={{ animationDelay: `${0.8}s` }}>.</span>
          <span style={{ animationDelay: `${0.9}s` }}>.</span>
          <span style={{ animationDelay: `${1}s` }}>.</span>
        </div>
        <img
          src={loadingSlime}
          className={styles.loadingSlime}
          style={{ animationDuration: `14s`, animationDelay: `${0.7}s` }}
        ></img>
      </div>
    </div>
  );
}
