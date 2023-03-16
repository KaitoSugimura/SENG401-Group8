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

  // const [pressedKeys, setPressedKeys] = useState({});

  const [up, setUp] = useState(false);
  const [left, setLeft] = useState(false);
  const [down, setDown] = useState(false);
  const [right, setRight] = useState(false);
  const intervalRef = useRef(null);

  function move(event) {

    if (event.keyCode === 87) { // 'W' key
      setUp(true);
    }
    if (event.keyCode === 65) { // 'A' key
      setLeft(true);
    }
    if (event.keyCode === 83) { // 'S' key
      setDown(true);
    }
    if (event.keyCode === 68 ) { // 'D' key
      setRight(true);
    }
  }

  
  function release(event) {
    if (event.keyCode === 87) { // 'W' key
      setUp(false);
    }
    if (event.keyCode === 65) { // 'A' key
      setLeft(false);
    }
    if (event.keyCode === 83) { // 'S' key]
      setDown(false);
    }
    if (event.keyCode === 68) { // 'D' key
      setRight(false);
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
