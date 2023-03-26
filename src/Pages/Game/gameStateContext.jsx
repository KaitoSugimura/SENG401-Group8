import { createContext, useState } from "react";

export const gameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState("Lobby");
  const [serverPlayerID, setServerPlayerID] = useState("");
  const [clientPlayerID, setClientPlayerID] = useState("");
  const [EndScreenData, setEndScreenData] = useState({Won: false, enemyID: null, gold: 0});


  return (
    <gameStateContext.Provider
      value={{
        gameState,
        setGameState,
        serverPlayerID,
        clientPlayerID,
        setClientPlayerID,
        setServerPlayerID,
        EndScreenData,
        setEndScreenData,
      }}
    >
      {children}
    </gameStateContext.Provider>
  );
};
