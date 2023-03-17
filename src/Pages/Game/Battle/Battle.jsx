import { useCallback, useEffect, useRef, useState } from "react";
import { projectDatabase } from "../../../Database/firebase/config";
import { useAuthContext } from "../../../Database/Hooks/useAuthContext";
import styles from "./Battle.module.css";
import slime from "/assets/GameArt/EarthSlime/EarthSlime1.gif";

export default function Battle({ setGameState }) {
  const { user } = useAuthContext();
  const self = useRef({});
  const [s, ss] = useState({});
  const [enemy, setEnemy] = useState(null);

  const up = useRef(false);
  const left = useRef(false);
  const down= useRef(false);
  const right = useRef(false);
  const intervalRef = useRef(null);

  let playerId;
  let playerRef;

  if (user) {
    playerId = user.uid;
    playerRef = projectDatabase.ref(`players/${playerId}`);
  }

  const handleKeyPress = 
    (xChange = 0, yChange = 0) => {
      if (xChange != 0 || yChange != 0) {
        const p = self.current;
        if (xChange != 0 && yChange != 0) {
          p.left = p.left + xChange * 1;
          p.top = p.top + yChange * 1;
        } else {
          p.left = p.left + xChange * 1.25;
          p.top = p.top + yChange * 1.25;
        }

        if (xChange > 0) {
          p.direction = "right";
        } else if (xChange < 0) {
          p.direction = "left";
        }
        playerRef.set(p);
        self.current = p;  
        ss({...p});                            ` `
        
        console.log("FAAA:" , self.current);
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

    self.current = { top: 0, left: 0, direction: "right", name: user.displayName };
  }, []);

  useEffect(() => {
    const allPlayersRef = projectDatabase.ref("players");
    allPlayersRef.on("value", (snapshot) => {
      if (snapshot.numChildren() >= 2) {
        allPlayersRef.off();
        snapshot.forEach((childSnapshot) => {
          const otherPlayerId = childSnapshot.key;
          if (playerId != otherPlayerId) {
            const otherPlayersRef = projectDatabase.ref(
              `players/${otherPlayerId}`
            );
            otherPlayersRef.on("value", (otherSnapshot) => {
              setEnemy(otherSnapshot.val());
            });
          }
        });
      }
    });
  }, []);

  function move(event) {
    switch (event.keyCode) {
      case 87:
        up.current = true;
        break;
      case 65:
        left.current = true;
        break;
      case 83:
        down.current = true;
        break;
      case 68:
        right.current = true;
        break;
    }
  }

  function release(event) {
    switch (event.keyCode) {
      case 87:
        up.current = false;
        break;
      case 65:
        left.current = false;
        break;
      case 83:
        down.current = false;
        break;
      case 68:
        right.current = false;
        break;
    }
  }

  const moveCharacter = useCallback(() => {
    const speed = 1;
    let dx = 0;
    let dy = 0;

    if (up.current) {
      dy -= speed;
    }
    if (left.current) {
      dx -= speed;
    }
    if (down.current) {
      dy += speed;
    }
    if (right.current) {
      dx += speed;
    }
    handleKeyPress(dx, dy);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(moveCharacter, 32); // Update position every 32ms
    return () => clearInterval(intervalRef.current);
  }, [moveCharacter]);

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
          <div
            className={styles.character}
            style={{
              top: s.top + "vw",
              left: s.left + "vw",
            }}
            data-direction={s.direction}
          >
            <img src={slime} className={styles.slimeImage}></img>
            <p className={styles.characterName}>{s.name}</p>
          </div>
          {enemy&& <div
              className={styles.character}
              style={{
                top: enemy.top + "vw",
                left: enemy.left + "vw",
              }}
              data-direction={enemy.direction}
            >
              <img src={slime} className={styles.slimeImage}></img>
              <p className={styles.characterName}>{enemy.name}</p>
            </div>}
        </div>
      </div>
    </div>
  );
}
