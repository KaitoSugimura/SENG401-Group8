import styles from "./EndScreen.module.css";
import slime from "/assets/GameArt/EarthSlime/EarthSlime1.gif";
import PlayerBanner from "./PlayerBanner";
import { useContext, useEffect, useRef, useState } from "react";

export default function EndScreen({setGameState}) {
  
  return (
    <div className={styles.EndScreen}>
      <p>+ 20 Rank Points</p>
      <div className={styles.players}>
        <PlayerBanner left={true} winner={true}></PlayerBanner>
        <PlayerBanner left={false} winner={false}></PlayerBanner>
      </div>
      <button onClick={() => setGameState("Lobby")} className={styles.returnToLobbyBtn}>Go back to Lobby in shame</button>
    </div>
  )
}
