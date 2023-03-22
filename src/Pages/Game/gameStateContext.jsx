import { createContext, useState } from "react";


export const gameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
    const [gameState, setGameState] = useState("Lobby");
    const [serverPlayerID, setServerPlayerID] = useState("");
    const [clientPlayerID, setClientPlayerID] = useState("");

    

  return (
    <gameStateContext.Provider value={{ gameState, setGameState, serverPlayerID, clientPlayerID, setClientPlayerID, setServerPlayerID }}>
      {children}
    </gameStateContext.Provider>
  );
};
