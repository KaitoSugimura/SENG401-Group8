import styles from "./EndScreen.module.css";
import slime from "/assets/GameArt/EarthSlime/EarthSlime1.gif";
import PlayerBanner from "./PlayerBanner";
import { useContext, useEffect, useRef, useState } from "react";
import AccountBanner from "../../../Components/AccountBanner";

export default function EndScreen({ setGameState }) {
  return (
    <div className={styles.EndScreen}>
      <p>+ 20 Rank Points</p>
      <PlayerBanner left={true} winner={true}></PlayerBanner>
      <PlayerBanner left={false} winner={false}></PlayerBanner>
      <button
        onClick={() => setGameState("Lobby")}
        className={styles.returnToLobbyBtn}
      >
        Go back to Lobby in shame
      </button>
    </div>
  );
}
