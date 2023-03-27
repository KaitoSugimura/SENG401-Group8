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

  const tips = [
    "Use WASD to move",
    "Aim with mouse and shoot slimeballs with space",
    "Use E to toggle buffed slimeball type",
    "Slimeballs will become buffed after rebounding 3 times",
    "green slimeballs heal and blue buff your attack stat",
    "Characters have different strengths and weaknesses. Adapt your playstyle to fit."
  ]
  const[tip, setTip]=useState(tips[Math.floor(Math.random()*tips.length)])
  const[tipIteration, setIteration]=useState(0);

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
            newRankedRoomRef.off();
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
        <div className={styles.playerInfo}>
          <h1>{user.displayName}</h1>
          <img src={user.data.slimePath+".gif"} alt="slime" />
          <div className={styles.rank}>
            <h2>Rank: {user.data.rankPoints}</h2>
          </div>
        </div>
        
        <div className={styles.rightSide}>
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
          <div className={styles.loadingTips}>
            {<span onAnimationIteration={()=>{
              setIteration(tipIteration+1);
              if(tipIteration%2==0){
                setTip(tips[Math.floor(Math.random()*tips.length)]);
              }
              
            }}>{tip}</span>}
          </div>
          <div
                className={styles.returnButton}
                onClick={() => {
                  projectDatabase.ref(`lobby/queue/${user.uid}`).remove();
                  setGameState("Lobby");
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
      </div>
    </div>
  );
}
