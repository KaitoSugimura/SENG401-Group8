import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthContextProvider } from "./Database/context/AuthContext";
import { GameStateProvider } from "./Pages/Game/gameStateContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <GameStateProvider>
        <App />
      </GameStateProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
