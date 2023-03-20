import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../Database/context/AuthContext";
import { projectDatabase } from "../../../Database/firebase/config";
import styles from "./Battle.module.css";
import slime from "/assets/GameArt/IceSlime/IceSlime1.gif";
import map from "/assets/GameMap/SlimeMeadows.svg";

export default function Battle({ setGameState }) {
  const { user } = useContext(AuthContext);
  const self = useRef({});
  const enemy = useRef(null);
  const [reRender, Render] = useState({});

  const up = useRef(false);
  const left = useRef(false);
  const down = useRef(false);
  const right = useRef(false);

  const intervalRef = useRef(null);

  const battleFieldWidth = useRef(90); // If these numbers are to be changed, change in the useEffect below
  const battleFieldHeight = useRef(50.625);

  const projectile = useRef({
    x: 6,
    y: 4,
    dx: 1,
    dy: 1,
    rad: 1,
    speed: 30,
  });

  const canvasRef = useRef(null);

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
    //xChange != 0 || yChange != 0
    if (true) {
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

      self.current = p;

      if(projectile.current.x <= self.current.left + 2.5 
        && projectile.current.x >= self.current.left - 2.5
        && projectile.current.y <= self.current.top + 2
        && projectile.current.y >= self.current.top - 2){
        self.current.top = 1.2;
        self.current.left = 2.1;
        setGameState("EndScreen");
      }

      playerRef.set({...self.current, left: self.current.left/battleFieldWidth.current, top: self.current.top/battleFieldHeight.current});
    }
  };

  useEffect(() => {
    // Initialize game
    self.current = {
      top: 1.2,
      left: 2.1,
      direction: "right",
      name: user.displayName,
    };

    playerRef.set({...self.current, left: self.current.left/battleFieldWidth.current, top: self.current.top/battleFieldHeight.current});
    playerRef.onDisconnect().remove();

    Render(Date.now());
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
              const p = otherSnapshot.val();   
              if(p === null) enemy.current = null;
              else enemy.current = {...p, left: p.left*battleFieldWidth.current, top: p.top*battleFieldHeight.current};
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

  const shoot = () => {

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
      case 32:
        shoot();
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
    projectile.current.x += projectile.current.dx;
    projectile.current.y += projectile.current.dy;

    if(projectile.current.y - projectile.current.rad <= 0 || projectile.current.y + projectile.current.rad >= battleFieldHeight.current){
      projectile.current.dy *= -1;
    }
    if(projectile.current.x - projectile.current.rad <= 0 || projectile.current.x + projectile.current.rad >= battleFieldWidth.current){
      projectile.current.dx *= -1;
    }
    Render(Date.now());
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
        <div className={styles.battleFieldContainer}>
          
          <div
            className={styles.battleField}
            style={{
              width: battleFieldWidth.current + "vw",
              height: battleFieldHeight.current + "vw",
            }}
          >
            {/* <img src={map} className={styles.battleFieldImage}></img> */}
            <video width="100%" height="100%" autoPlay>
            <source src="/assets/video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
            {/* PROJECTILES START */}
            <div className={styles.projectile}
          style={{
              top: projectile.current.y + "vw",
              left: projectile.current.x + "vw",
            }}
            ></div>
            {/* PROJECTILES END */}
            {/* TEMP HIT BOX POINTS */}
            <span className={styles.TestHitBoxPoints} style={{
                top: self.current.top + 1.5 + "vw",
                left: self.current.left + "vw",
              }}></span>
              <span className={styles.TestHitBoxPoints} style={{
                top: self.current.top -1.5 + "vw",
                left: self.current.left + "vw",
              }}></span>
              <span className={styles.TestHitBoxPoints}style={{
                top: self.current.top + "vw",
                left: self.current.left +2+ "vw",
              }}></span>
              <span className={styles.TestHitBoxPoints}style={{
                top: self.current.top + "vw",
                left: self.current.left-2 + "vw",
              }}></span>
              {/* TEMP HIT BOX POINTS END */}
            <div
              className={`${styles.character} ${styles.self}`}
              style={{
                top: self.current.top + "vw",
                left: self.current.left + "vw",
              }}
              data-direction={self.current.direction}
            >
              
              <img src={slime} className={styles.slimeImage}></img>
              <p className={styles.characterName}>{self.current.name}</p>
            </div>
            {enemy.current && (
              <div
                className={styles.character}
                style={{
                  top: enemy.current.top + "vw",
                  left: enemy.current.left + "vw",
                }}
                data-direction={enemy.current.direction}
              >
                <img src={slime} className={styles.slimeImage}></img>
                <p className={styles.characterName}>{enemy.current.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
