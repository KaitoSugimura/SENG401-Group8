import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../Database/context/AuthContext";
import { projectDatabase } from "../../../Database/firebase/config";
import styles from "./Battle.module.css";
import slime from "/assets/GameArt/IceSlime/IceSlime1.gif";

export default function Battle({ setGameState }) {
  const { user } = useContext(AuthContext);
  const self = useRef({});
  const [s, ss] = useState({});
  const [enemy, setEnemy] = useState(null);

  const up = useRef(false);
  const left = useRef(false);
  const down = useRef(false);
  const right = useRef(false);
  const intervalRef = useRef(null);

  const battleFieldWidth = useRef(90); // If these numbers are to be changed, change in the useEffect below
  const battleFieldHeight = useRef(50.625);

  let playerId;
  let playerRef;

  if (user) {
    playerId = user.uid;
    playerRef = projectDatabase.ref(`players/${playerId}`);
  }

  // Calculate battle field dimensions
  // (window.innerHeight - 65)/window.innerWidth

  useEffect(() => {
    battleFieldWidth.current = 90;
    battleFieldHeight.current = 50.625;
    const ratio = (window.innerHeight - 65) / window.innerWidth;
    if (ratio < 0.5625) {
      battleFieldWidth.current = battleFieldWidth.current * (ratio / 0.5625);
      battleFieldHeight.current = battleFieldWidth.current * 0.5625;
    }
  }, [window.innerWidth, window.innerHeight]);

  const handleKeyPress = (xChange = 0, yChange = 0) => {
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

      p.left = Math.min(Math.max(p.left, 2.1), battleFieldWidth.current - 2.5);
      p.top = Math.min(Math.max(p.top, 1.2), battleFieldHeight.current - 2);

      playerRef.set(p);
      self.current = p;
      ss({ ...p });
      ` `;
    }
  };

  useEffect(() => {
    // Initialize game
    playerRef.set({
      id: playerId,
      name: user.displayName,
      direction: "right",
      top: 1.2,
      left: 2.1,
    });
    playerRef.onDisconnect().remove();

    self.current = {
      top: 1.2,
      left: 2.1,
      direction: "right",
      name: user.displayName,
    };
    ss(self.current);
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
        <div className={styles.battleFieldContainer}>
          <div
            className={styles.battleField}
            style={{
              width: battleFieldWidth.current + "vw",
              height: battleFieldHeight.current + "vw",
            }}
          >
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
            {enemy && (
              <div
                className={styles.character}
                style={{
                  top: enemy.top + "vw",
                  left: enemy.left + "vw",
                }}
                data-direction={enemy.direction}
              >
                <img src={slime} className={styles.slimeImage}></img>
                <p className={styles.characterName}>{enemy.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
