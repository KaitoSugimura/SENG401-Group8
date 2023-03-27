import { createContext, useContext, useState } from "react";
import Battle from "./Battle/Battle";
import EndScreen from "./EndScreen/EndScreen";
import styles from "./Game.module.css";
import { gameStateContext } from "./gameStateContext";
import Lobby from "./Lobby/Lobby";
import Queue from "./Queue/Queue";
import Room from "./Room/Room";

export default function Game() {
  /**
   * FOUR GAME STATES
   * Lobby
   * Room
   * Battle
   * EndScreen
   */

  const { gameState, setGameState } = useContext(gameStateContext);

  // console.log(gameState);

  let gamePage;
  if (gameState === "Lobby") {
    gamePage = <Lobby setGameState={setGameState} />;
  } else if (gameState === "Room") {
    gamePage = <Room setGameState={setGameState} />;
  } else if (gameState === "Battle" || gameState === "RankedBattle") {
    gamePage = <Battle setGameState={setGameState} />;
  } else if (gameState === "EndScreen") {
    gamePage = <EndScreen setGameState={setGameState} />;
  } else if (gameState === "Queue") {
    gamePage = <Queue setGameState={setGameState} />;
  } else {
    gamePage = (
      <div className={styles.error}>
        Error loading page! The developers of this website sucks!!
      </div>
    );
  }

  return <div className={styles.game}>{gamePage}</div>;
}
