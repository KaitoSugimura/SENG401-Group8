import { useEffect, useRef, useState } from "react";
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
    playerId = user.uid;
    playerRef = projectDatabase.ref(`players/${playerId}`);
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

  const [up, setUp] = useState(false);
  const [left, setLeft] = useState(false);
  const [down, setDown] = useState(false);
  const [right, setRight] = useState(false);
  const intervalRef = useRef(null);

  function move(event) {

    switch(event.keyCode){
      case 87:
        setUp(true);
        break;
      case 65:
        setLeft(true);
        break;
      case 83:
        setDown(true);
        break;
      case 68:
        setRight(true);
        break;
      
    }
  }

  
  function release(event) {
    switch(event.keyCode){
      case 87:
        setUp(false);
        break;
      case 65:
        setLeft(false);
        break;
      case 83:
        setDown(false);
        break;
      case 68:
        setRight(false);
        break;
      
    }
  }

  useEffect(() => {  
    function moveCharacter() {
    const speed = 5; // Adjust as needed
    let dx = 0;
    let dy = 0;

    if (up) {
      dy -= 1;
    }
    if (left) {
      dx -= 1;
    }
    if (down) {
      dy += 1;
    }
    if (right) {
      dx += 1;
    }

    console.log("MOVE", dx, dy)

    handleKeyPress(dx, dy);
  }
    intervalRef.current = setInterval(moveCharacter, 16); // Update position every 16ms (60fps)
    return () => clearInterval(intervalRef.current);
  }, [Players, up,left, down, right]);

  return (
    <div class={styles.ButtonOverlay}
    role="button"
    tabIndex="0"
    onKeyDown={(e) => move(e)}
    onKeyUp={(e) => release(e)}
    >
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
