import { useCallback, useEffect, useRef, useState } from "react";
import { projectDatabase } from "../../../Database/firebase/config";
import { useAuthContext } from "../../../Database/Hooks/useAuthContext";
import styles from "./Lobby.module.css";

export default function Lobby({setGameState}) {
  // const { user } = useAuthContext();
  // const [Players, setPlayers] = useState({});
  // let playerId;
  // let playerRef;

  // if (user) {
  //   playerId = user.uid;
  //   playerRef = projectDatabase.ref(`players/${playerId}`);
  // }

  // const handleKeyPress = useCallback((xChange = 0, yChange = 0) => {
  //   if (xChange != 0 || yChange !=0) {
  //     const p = Players[playerId];
  //     if(xChange!=0 && yChange!=0){
  //       p.left = p.left + xChange * 1;
  //       p.top = p.top + yChange * 1;
  //     } else {
  //       p.left = p.left + xChange * 1.25;
  //       p.top = p.top + yChange * 1.25;
  //     }

  //     if (xChange > 0) {
  //       p.direction = "right";
  //     } else if (xChange < 0) {
  //       p.direction = "left";
  //     }
  //     playerRef.set(p);
  //   }
  // }, [Players]);

  // useEffect(() => {
  //   // Initialize game
  //   playerRef.set({
  //     id: playerId,
  //     name: user.displayName,
  //     direction: "right",
  //     top: 0,
  //     left: 0,
  //   });
  //   playerRef.onDisconnect().remove();

  //   const allPlayersRef = projectDatabase.ref("players");

  //   allPlayersRef.on("value", (snapshot) => {
  //     setPlayers(snapshot.val());
  //   });

  //   return () => {
  //     allPlayersRef.off();
  //   }
  // }, []);

  // const [up, setUp] = useState(false);
  // const [left, setLeft] = useState(false);
  // const [down, setDown] = useState(false);
  // const [right, setRight] = useState(false);
  // const intervalRef = useRef(null);


  // const moveCharacter = useCallback(() => {
  //   let x = 1;
  //   if(up){
  //     x =-1;
  //   }
  //   setUp(!up);
  //   handleKeyPress(0, x);
  // }, [Players, up])

  // useEffect(() => {
  //   intervalRef.current = setInterval(moveCharacter, 32); // Update position every 32ms 
  //   return () => clearInterval(intervalRef.current);
  // }, [Players, moveCharacter]);

  return (
    <div>
      This is the lobby
      <button onClick={() => setGameState("Room")}>Join Room</button>
    </div>
  )
}
