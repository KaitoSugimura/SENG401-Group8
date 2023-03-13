import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthContextProvider } from "./Database/context/AuthContext";
import { CharacterAndThemeContextProvider } from "./Database/context/CharacterAndThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <CharacterAndThemeContextProvider>
        <App />
      </CharacterAndThemeContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
