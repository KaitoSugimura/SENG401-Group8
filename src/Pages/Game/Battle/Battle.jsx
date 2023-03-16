import { useEffect, useState } from "react";
import { projectDatabase } from "../../../Database/firebase/config";
import { useAuthContext } from "../../../Database/Hooks/useAuthContext";
import styles from "./Battle.module.css";
import slime from "/assets/GameArt/EarthSlime/EarthSlime1.gif"
// import KeyboardControls from "./KeyboardControls";
// import { keyPressListener } from "./KeyHandler";

export default function Battle({ setGameState }) {
  const { user } = useAuthContext();
  const [Players, setPlayers] = useState({});
  let playerId;
  let playerRef;

  if (user) {
    console.log("User:", user);
    playerId = user.uid;
    playerRef = projectDatabase.ref(`players/${playerId}`);

    console.log("PLAYER REF: ", playerRef);
  }

  const handleKeyPress = (xChange = 0, yChange = 0) => {
    console.log("AUGH-keyPress", Players);
    const newX = Players[playerId].left + xChange*10;
    const newY = Players[playerId].top + yChange*10;

    if (true) {
      Players[playerId].left = newX;
      Players[playerId].top = newY;
      if (xChange === 1) {
        Players[playerId].direction = "right";
      }
      if (yChange === -1) {
        Players[playerId].direction = "left";
      }
      playerRef.set(Players[playerId]);
    }
    console.log("PRESSED: ", Players[playerId].top, playerId);
  };

  useEffect(() => {
    // Initialize game
    playerRef.set({
      id: playerId,
      name: user.displayName,
      direction: "right",
      top: 0,
      left: 0,
    });
    playerRef.onDisconnect().remove();
    
    const allPlayersRef = projectDatabase.ref("players");

    allPlayersRef.on("value", (snapshot) => {
      setPlayers(snapshot.val());
    });
  }, []);

  const move = ({ keyCode }) => {
    switch (keyCode) {
      case 87: //W
        handleKeyPress(0, -1);
        break;
      case 65: //A
        handleKeyPress(-1, 0);
        break;
      case 83: //S
        handleKeyPress(0, 1);
        break;
      case 68: //D
        handleKeyPress(1, 0);
        break;
    }
  };

  return (
    <div class={styles.ButtonOverlay}
    role="button"
    tabIndex="0"
    onKeyDown={(e) => move(e)}>
      <div
        class={styles.battleContainer}
      >
        This where you battle
        <button
          onClick={() => {
            playerRef.remove();
            setGameState("EndScreen");
          }}
        >
          End Battle
        </button>
        <div className={styles.battleField}>
          {Object.values(Players).map((player, i) => (
            <div
              className={styles.character}
              key={i}
              style={{
                top: player.top,
                left: player.left
              }}
            > <img src={slime} className={styles.slimeImage}></img>
              <p className={styles.characterName}>{player.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
