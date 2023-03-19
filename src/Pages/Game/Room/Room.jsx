import Player from "./Player";
import styles from "./Room.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Database/context/AuthContext";

export default function Room({setGameState}) {
  const { user } = useContext(AuthContext);
  return (
    <div className={styles.roomPage}>
      <Player number={1} user={user}></Player>
      <div className={styles.match}>
        <button onClick={() => setGameState("Battle")}>Start Battle</button>
      </div>
      <Player number={2} user={user}></Player>
    </div>
  )
}
