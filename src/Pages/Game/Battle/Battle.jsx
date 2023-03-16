import { useEffect, useRef, useState } from "react";
import { projectDatabase } from "../../../Database/firebase/config";
import { useAuthContext } from "../../../Database/Hooks/useAuthContext";
import styles from "./Battle.module.css";
import slime from "/assets/GameArt/EarthSlime/EarthSlime1.gif";
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
    const p = Players[playerId];
    let newX;
    let newY;
    if(xChange!=0 && yChange!=0){
      newX = p.left + xChange * 7.5;
      newY = p.top + yChange * 7.5;
    } else {
      newX = p.left + xChange * 10;
      newY = p.top + yChange * 10;
    }

    if (true) {
      p.left = newX;
      p.top = newY;
      if (xChange > 0) {
        p.direction = "right";
      } else if (xChange < 0) {
        p.direction = "left";
      }
      playerRef.set(p);
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
    switch (event.keyCode) {
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
    switch (event.keyCode) {
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
      const speed = 4; // Adjust as needed
      let dx = 0;
      let dy = 0;

      if (up) {
        dy -= speed;
      }
      if (left) {
        dx -= speed;
      }
      if (down) {
        dy += speed;
      }
      if (right) {
        dx += speed;
      }
      handleKeyPress(dx, dy);
    }
    intervalRef.current = setInterval(moveCharacter, 96); // Update position every 48ms (20fps)
    return () => clearInterval(intervalRef.current);
  }, [Players, up, left, down, right]);

  return (
    <div
      class={styles.ButtonOverlay}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => move(e)}
      onKeyUp={(e) => release(e)}
    >
      <div class={styles.battleContainer}>
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
                left: player.left,
              }}
              data-direction={player.direction}
            >
              {" "}
              <img src={slime} className={styles.slimeImage}></img>
              <p className={styles.characterName}>{player.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
