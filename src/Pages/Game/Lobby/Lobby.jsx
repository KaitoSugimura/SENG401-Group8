import { useCallback, useEffect, useRef, useState } from "react";
import { projectDatabase } from "../../../Database/firebase/config";
import { useAuthContext } from "../../../Database/Hooks/useAuthContext";
import styles from "./Lobby.module.css";

export default function Lobby({setGameState}) {

  return (
    <div>
      This is the lobby
      <button onClick={() => setGameState("Room")}>Join Room</button>
    </div>
  )
}
