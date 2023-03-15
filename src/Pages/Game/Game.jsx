import { useState } from "react";
import styles from "./Game.module.css";

export default function Game() {

  /**
   * THREE GAME STATES
   * Lobby
   * Room
   * Battle
   */

  const [ gameState, setGameState ] = useState("Lobby");


  let gamePage = <div className={styles.error}>Error loading page! The developers of this website sucks!!</div>;
  if(gameState === "Lobby"){
    
  }

  return <div className={styles.game}>
    {gamePage}
  </div>;
}
