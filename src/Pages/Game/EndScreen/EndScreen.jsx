import styles from "./EndScreen.module.css";
import slime from "/assets/GameArt/EarthSlime/EarthSlime1.gif";
import PlayerBanner from "./PlayerBanner";
import gold from "../../.././../public/assets/GameArt/Gold.png"
import { useContext, useEffect, useRef, useState } from "react";
import AccountBanner from "../../../Components/AccountBanner";

export default function EndScreen({ setGameState }) {
  // placeholder for if the win screen is ranked version or not
  const[ranked,setRanked]=useState(true);
  const[winner,setWinner]=useState(true); ///Check intially if current player is winner
  //left and right side is just determined by which player is viewing the screen
  return (
    <div className={styles.EndScreen}>
      <div className={styles.rewards}>
        <p>{winner?"+20 Rank Points":"-20 Rank Points"}</p>
        <img src={gold} alt=""/>
        <p>{winner?"+100 Gold":"-100 Gold"}</p>
      </div>
      
      <PlayerBanner left={true} winner={false}></PlayerBanner>
      <PlayerBanner left={false} winner={true}></PlayerBanner>
      <div className={styles.buttonContainer}>
        {/* BOTH BUTTONS GO BACK TO LOBBY RN */}
        <button
          onClick={() => setGameState("Lobby")}
          className={styles.returnToLobbyBtn}
        >
          Lobby
        </button>
        {ranked&&<button
          onClick={() => setGameState("Lobby")}
          className={styles.returnToLobbyBtn}
        >
          Play Again
        </button>}
      </div>
      
    </div>
  );
}
