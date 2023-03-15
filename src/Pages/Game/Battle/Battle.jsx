import { useEffect, useState } from "react";
import { projectDatabase } from "../../../Database/firebase/config";
import { useAuthContext } from "../../../Database/Hooks/useAuthContext";
import styles from "./Battle.module.css";

export default function Battle({ setGameState }) {
  const { user } = useAuthContext();

  const [Players, setPlayers] = useState([]);

  const initGame = () => {
    const allPlayersRef = projectDatabase.ref("players");

    allPlayersRef.on("value", (snapshot) => {
      const props = [];
      for(const [key, value] of Object.entries(snapshot.val())){
        props.push(value);
        console.log(value);
      }
      if(!Players.includes(snapshot.val())){
        setPlayers(props);
      }
    });

    // allPlayersRef.on("value", (snapshot) => {

    // });
    // allPlayersRef.on("child_added", (snapshot) => {
    //   console.log("AAAAAAAAAAAAAAAAAAAAAA");
    //   const addedPlayer = snapshot.val();
    //   const characterElement = document.createElement("div");
    //   characterElement.classList.add(styles.character);
    //   if(addedPlayer.id === playerId) {
    //     characterElement.classList.add("you");
    //   }
    // });
  };

  let playerId;
  let playerRef;

  if (user) {
    console.log(user);
    playerId = user.uid;
    playerRef = projectDatabase.ref(`players/${playerId}`);

    playerRef.set({
      id: playerId,
      name: user.displayName,
      direction: "right",
      color: "blue",
    });
    // playerRef.onDisconnect().remove();
  }

  useEffect(() => {
    initGame();
  }, []);

  return (
    <div class="battle-container">
      This where you battle
      <button
        onClick={() => {
          playerRef.remove();
          setGameState("EndScreen");
        }}
      >
        End Battle
      </button>
      <div className={styles.temp}>
        People in game right now:
      {Players.map((player, i) => (
        <div className={styles.character} key={i}>
          {player.name}
        </div>
      ))}
      </div>
    </div>
  );
}
