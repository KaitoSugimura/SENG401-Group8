import { createContext, useContext, useState } from "react";
import Battle from "./Battle/Battle";
import EndScreen from "./EndScreen/EndScreen";
import styles from "./Game.module.css";
import { gameStateContext } from "./gameStateContext";
import Lobby from "./Lobby/Lobby";
import Room from "./Room/Room";

export const gameContext = createContext();

export default function Game() {
  /**
   * FOUR GAME STATES
   * Lobby
   * Room
   * Battle
   * EndScreen
   */

  const {gameState, setGameState} = useContext(gameStateContext);
  const {serverPlayerID, setServerPlayerID} = useContext(gameStateContext);
  const {clientPlayerID, setClientPlayerID} = useContext(gameStateContext);

  console.log(gameState);

  let gamePage;
  if (gameState === "Lobby") {
    gamePage = <Lobby setGameState={setGameState} />;
  } else if (gameState === "Room") {
    gamePage = <Room setGameState={setGameState} />;
  } else if (gameState === "Battle") {
    gamePage = <Battle setGameState={setGameState} />;
  } else if (gameState === "EndScreen") {
    gamePage = <EndScreen setGameState={setGameState} />;
  } else {
    gamePage = (
      <div className={styles.error}>
        Error loading page! The developers of this website sucks!!
      </div>
    );
  }

  return (
    <gameContext.Provider
      value={{
        serverPlayerID,
        setServerPlayerID,
        clientPlayerID,
        setClientPlayerID,
      }}
    >
      <div className={styles.game}>{gamePage}</div>
    </gameContext.Provider>
  );
}
