import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthContextProvider } from "./Database/context/AuthContext";
import { GameStateProvider } from "./Pages/Game/gameStateContext";
import { setupStore } from './store';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <GameStateProvider>
        {/* Adding Redux store globally */}
        <Provider store={setupStore()}>
          <App />
        </Provider>
      </GameStateProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
