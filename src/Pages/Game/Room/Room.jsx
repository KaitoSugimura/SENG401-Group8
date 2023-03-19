import Player from "./Player";
import styles from "./Room.module.css";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../../Database/context/AuthContext";

export default function Room({setGameState}) {
  const { user } = useContext(AuthContext);
  const battleFieldWidth = useRef(48); 
  const battleFieldHeight = useRef(27);

  useEffect(()=>{
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
      <Player number={1} user={user}></Player>
      <div className={styles.match}>
        <div className={styles.map}
        style={{width:battleFieldWidth.current + "vw",height: battleFieldHeight.current + "vw",}}>
          <img src="" alt="" /> 
          {/* ADD MAP IMAGE HERE! */}
        </div>
        <div className={styles.goldContainer}>
          <div className={styles.mapName}>Slime Meadows</div>
          <div className={styles.goldImage}><img src="assets/GameArt/Gold.png" alt="" /></div>
          <div className={styles.goldText}>x{user.data.gold}</div>
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.selectionButton} onClick={()=>setGameState("Battle")}><img src="assets/GameArt/PlayButton.png" alt="" /></div>
          <div className={styles.selectionButton} onClick={()=>setGameState("Lobby")}><img src="assets/GameArt/RestartButton.png" alt="" /></div>
        </div>
        
      </div>
      <Player number={2} user={user}></Player>
    </div>
  )
}
