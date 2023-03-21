import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../Database/context/AuthContext";
import { projectDatabase } from "../../../Database/firebase/config";
import LoadingScreen from "../LoadingScreen";
import styles from "./Battle.module.css";
import GameCountDown from "./GameCountDown";
import map from "/assets/GameMap/SlimeMeadows.webp";

export default function Battle({ setGameState }) {
  const { user } = useContext(AuthContext);
  const self = useRef({});
  const enemy = useRef(null);
  const [reRender, Render] = useState({});

  const [loading, setLoading] = useState(true);
  const controlsDead = useRef(true);
  const [countDown, setCountDown] = useState(false);

  const up = useRef(false);
  const left = useRef(false);
  const down = useRef(false);
  const right = useRef(false);
  const mousePos = useRef({ x: null, y: null });

  const selfCompRef = useRef(null);

  const intervalRef = useRef(null);

  const battleFieldWidth = useRef(90); // If these numbers are to be changed, change in the useEffect below
  const battleFieldHeight = useRef(50.625);

  const projectiles = useRef([]);
  const enemyProjectiles = useRef([]);

  const buttonDivRef = useRef(null);

  let ProjectileKey = useRef(0);

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
      playerRef.set({
        ...self.current,
        left: self.current.left / battleFieldWidth.current,
        top: self.current.top / battleFieldHeight.current,
      });
    }
  };

  function handleMouseMove(event) {
    mousePos.current = {
      x: event.pageX,
      y: event.pageY,
    };
    console.log(
      mousePos.current,
      selfCompRef.current.getBoundingClientRect().left,
      selfCompRef.current.getBoundingClientRect().top
    );
  }

  useEffect(() => {
    buttonDivRef.current.focus();
    // Initialize game
    self.current = {
      top: 1.2,
      left: 2.1,
      direction: "right",
      name: user.displayName,
      shooting: false,
    };

    playerRef.set({
      ...self.current,
      left: self.current.left / battleFieldWidth.current,
      top: self.current.top / battleFieldHeight.current,
    });
    playerRef.onDisconnect().remove();

    Render(Date.now());

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
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
              if (p === null) enemy.current = null;
              else
                enemy.current = {
                  ...p,
                  left: p.left * battleFieldWidth.current,
                  top: p.top * battleFieldHeight.current,
                };
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
    if(controlsDead.current)return;
    if (!self.current.shooting && projectiles.current.length < 5) {
      self.current.shooting = true;
      const SlimeToMouseVectorX =
        mousePos.current.x - selfCompRef.current.getBoundingClientRect().left;
      const SlimeToMouseVectorY =
        mousePos.current.y - selfCompRef.current.getBoundingClientRect().top;
      if (SlimeToMouseVectorX > 0) {
        self.current.direction = "right";
      } else {
        self.current.direction = "left";
      }
      setTimeout(() => {
        // Normalize Slime to mouse vectors
        const length = Math.sqrt(
          SlimeToMouseVectorX * SlimeToMouseVectorX +
            SlimeToMouseVectorY * SlimeToMouseVectorY
        );
        const normalizedX = SlimeToMouseVectorX / length;
        const normalizedY = SlimeToMouseVectorY / length;

        projectiles.current.push({
          x: self.current.left + normalizedX * 3,
          y: self.current.top + normalizedY * 3,
          dx: normalizedX * 1.5,
          dy: normalizedY * 1.5,
          rad: 1,
          bulletState: 0, // 0-2 damage, >=3 for healing
          key: ProjectileKey.current++,
        });
        setTimeout(() => {
          self.current.shooting = false;
        }, 100);
      }, 300);
    }
  };

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
    if(controlsDead.current)return;
    if (!self.current.shooting) {
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
    }
    for (let i = 0; i < projectiles.current.length; i++) {
      let projectile = projectiles.current[i];
      projectile.x += projectile.dx;
      projectile.y += projectile.dy;

      if (
        projectile.x <= self.current.left + 2.5 &&
        projectile.x >= self.current.left - 2.5 &&
        projectile.y <= self.current.top + 2 &&
        projectile.y >= self.current.top - 2
      ) {
        if (projectile.bulletState >= 3) {
          projectiles.current.splice(i, 1);
        } else {
          playerRef.onDisconnect().remove();
          setGameState("EndScreen");
        }
      }

      if (
        projectile.y - projectile.rad <= 0 ||
        projectile.y + projectile.rad >= battleFieldHeight.current
      ) {
        projectile.dy *= -1;
        projectile.bulletState++;
      }
      if (
        projectile.x - projectile.rad <= 0 ||
        projectile.x + projectile.rad >= battleFieldWidth.current
      ) {
        projectile.dx *= -1;
        projectile.bulletState++;
      }
    }

    Render(Date.now());
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(moveCharacter, 32); // Update position every 32ms
    return () => clearInterval(intervalRef.current);
  }, [moveCharacter]);

  return (
    <div
    ref={buttonDivRef}
      class={styles.ButtonOverlay}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => move(e)}
      onKeyUp={(e) => release(e)}
    >
      {loading&&<LoadingScreen />}
      {countDown&& <GameCountDown/>}
      <div class={styles.battleContainer}>
        <div className={styles.battleFieldContainer}>
          <div
            className={styles.battleField}
            style={{
              width: battleFieldWidth.current + "vw",
              height: battleFieldHeight.current + "vw",
            }}
          >
            <img src={map} className={styles.battleFieldImage} onLoad={() => {setTimeout(()=>{
              setCountDown(true);
              setLoading(false);
              setTimeout(()=>{
                controlsDead.current = false;
                setTimeout(()=>{
                  setCountDown(false);
                }, 1000);
              }, 3000);
            }, 1500)}}></img>
            {/* <video width="100%" height="100%" autoPlay>
            <source src="/assets/video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video> */}
            {/* PROJECTILES START */}
            {projectiles.current.map((projectile, i) => (
              <div
               className={`${styles.projectile} ${
                  projectile.bulletState > 2 ? styles.healing : ""
                }`}
                style={{
                  top: projectile.y + "vw",
                  left: projectile.x + "vw",
                  width: projectile.rad * 2 + "vw",
                  height: projectile.rad * 2 + "vw",
                }}
                key={projectile.key}
              ></div>
            ))}
            {/* PROJECTILES END */}
            {/* TEMP HIT BOX POINTS */}
            {/* <span
              className={styles.TestHitBoxPoints}
              style={{
                top: self.current.top + 1.5 + "vw",
                left: self.current.left + "vw",
              }}
            ></span>
            <span
              className={styles.TestHitBoxPoints}
              style={{
                top: self.current.top - 1.5 + "vw",
                left: self.current.left + "vw",
              }}
            ></span>
            <span
              className={styles.TestHitBoxPoints}
              style={{
                top: self.current.top + "vw",
                left: self.current.left + 2 + "vw",
              }}
            ></span>
            <span
              className={styles.TestHitBoxPoints}
              style={{
                top: self.current.top + "vw",
                left: self.current.left - 2 + "vw",
              }}
            ></span> */}
            {/* TEMP HIT BOX POINTS END */}
            <div
              className={`${styles.character} ${styles.self}`}
              style={{
                top: self.current.top + "vw",
                left: self.current.left + "vw",
              }}
              data-direction={self.current.direction}
            >
              <span ref={selfCompRef} className={styles.selfCenter}></span>
              <div className={self.current.shooting ? styles.shootingAnim : ""}>
                <img
                  src={user.data.slimePath + ".gif"}
                  className={styles.slimeImage}
                ></img>
              </div>
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
                <img
                  src={user.data.slimePath + ".gif"}
                  className={styles.slimeImage}
                ></img>
                <p className={styles.characterName}>{enemy.current.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
