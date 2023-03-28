import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../Database/context/AuthContext";
import {
  projectDatabase,
  projectFirestore,
} from "../../../Database/firebase/config";
import { gameStateContext } from "../gameStateContext";
import LoadingScreen from "../LoadingScreen";
import styles from "./Battle.module.css";
import GameCountDown from "./GameCountDown";
import map from "/assets/GameMap/SlimeMeadows.webp";
import rankedMap from "/assets/GameMap/RankedMap.webp";
import characterData from "../../../Database/JsxData/characters.jsx";

export default function Battle({ setGameState }) {
  const { user } = useContext(AuthContext);
  const {
    serverPlayerID,
    clientPlayerID,
    setEndScreenData,
    gameState,
    gameMode,
  } = useContext(gameStateContext);

  const self = useRef({});
  const enemy = useRef(null);
  const [reRender, Render] = useState(null);

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
  const currentProjectileShotAmount = useRef(0);
  // const enemyProjectiles = useRef([]);

  const buttonDivRef = useRef(null);

  // Sound
  const shootSoundRef = useRef(null);
  const hitNormalSoundRef = useRef(null);
  const weaponChangeSoundRef = useRef(null);
  const buffSoundRef = useRef(null);
  const healSoundRef = useRef(null);
  const EndSoundRef = useRef(null);

  const animationKey = useRef(2500);
  const animationKeyEnemy = useRef(5000);
  const hitAmount = useRef(0);
  const hitAmountEnemy = useRef(0);
  const gotHitStyle = useRef({});
  const gotHitStyleEnemy = useRef({});

  const { charactersData } = characterData;
  let CDIndex = 0;
  for (let i = 0; i < charactersData.length; i++) {
    if (charactersData[i].type === user.data.slimeType) {
      CDIndex = i;
      break;
    }
  }
  const MAX_HP = charactersData[CDIndex].health * 100;
  const DMG = charactersData[CDIndex].power * 3;
  const SPEED = 1 + (charactersData[CDIndex].speed - 3) / 5;

  useEffect(() => {
    if (shootSoundRef.current)
      shootSoundRef.current.volume = Math.min(1.1 * user.data.musicVolume, 1);
    if (hitNormalSoundRef.current)
      hitNormalSoundRef.current.volume = Math.min(
        1.2 * user.data.musicVolume,
        1
      );
    if (weaponChangeSoundRef.current)
      weaponChangeSoundRef.current.volume = Math.min(
        1.05 * user.data.musicVolume,
        1
      );
    if (buffSoundRef.current)
      buffSoundRef.current.volume = Math.min(0.75 * user.data.musicVolume, 1);
    if (healSoundRef.current)
      healSoundRef.current.volume = Math.min(1.05 * user.data.musicVolume, 1);
    if (EndSoundRef.current) EndSoundRef.current.volume = user.data.musicVolume;
  }, [
    shootSoundRef,
    hitNormalSoundRef,
    weaponChangeSoundRef,
    buffSoundRef,
    healSoundRef,
  ]);

  let playerId;
  let playerRef;
  let projectileRef;
  let projectileDeletionRef;
  const nextProjectileToDeleteQueue = useRef(0);
  // let projectileBuffMode = useRef(false);

  let goldBetAmount = 0;

  if (user) {
    playerId = user.uid;
    if (playerId === serverPlayerID) {
      playerRef = projectDatabase.ref(
        `battle/${serverPlayerID}/${serverPlayerID}`
      );
      projectileRef = projectDatabase.ref(
        `battle/${serverPlayerID}/serverProjectile`
      );
      projectileDeletionRef = projectDatabase.ref(
        `battle/${serverPlayerID}/serverProjectileDeletion`
      );
    } else {
      playerRef = projectDatabase.ref(
        `battle/${serverPlayerID}/${clientPlayerID}`
      );
      projectileRef = projectDatabase.ref(
        `battle/${serverPlayerID}/clientProjectile`
      );
      projectileDeletionRef = projectDatabase.ref(
        `battle/${serverPlayerID}/clientProjectileDeletion`
      );
    }
    playerRef.onDisconnect().remove();
    projectileRef.onDisconnect().remove();
    projectileDeletionRef.onDisconnect().remove();
  }
  let ProjectileKey = useRef(playerId === serverPlayerID ? 10000 : 1);

  // Calculate battle field dimensions
  // (window.innerHeight - 65)/window.innerWidth

  useEffect(() => {
    battleFieldWidth.current = 95;
    battleFieldHeight.current = 53.4375;
    const ratio = window.innerHeight / window.innerWidth;
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
        HP: (self.current.HP / MAX_HP) * 100,
        // time: Date.now(),
      });
    }
  };

  function handleMouseMove(event) {
    mousePos.current = {
      x: event.pageX,
      y: event.pageY,
    };
  }

  useEffect(() => {
    let loadWaitRef = projectDatabase.ref(
      `battle/${serverPlayerID}/loadComplete`
    );

    loadWaitRef.off();
    loadWaitRef.on("value", (snapshot) => {
      const p = snapshot.val();
      if (p && p.server && p.client) {
        loadWaitRef.off();
        setCountDown(true);
        setLoading(false);
        setTimeout(() => {
          controlsDead.current = false;
          setTimeout(() => {
            setCountDown(false);
          }, 1000);
        }, 3000);
      }
    });

    if (gameMode === "Custom") {
      projectDatabase
        .ref(`lobby/rooms/${serverPlayerID}/gold`)
        .once("value", (snapShot) => {
          if (snapShot.val()) {
            goldBetAmount = snapShot.val();
          }
        });
    }

    buttonDivRef.current.focus();
    // Initialize game
    if (serverPlayerID === playerId) {
      self.current = {
        top: battleFieldHeight.current / 2,
        left: battleFieldWidth.current / 5,
        direction: "right",
        name: user.displayName,
        shooting: false,
        slimePath: user.data.slimePath,
        HP: MAX_HP,
        DMG: DMG,
        initDMG: charactersData[CDIndex].power,
        projectileBuffMode: false,
        // time: Date.now(),
      };
    } else {
      self.current = {
        top: battleFieldHeight.current / 2,
        left: (4 * battleFieldWidth.current) / 5,
        direction: "left",
        name: user.displayName,
        shooting: false,
        slimePath: user.data.slimePath,
        HP: MAX_HP,
        DMG: DMG,
        initDMG: charactersData[CDIndex].power,
        projectileBuffMode: false,
        // time: Date.now(),
      };
    }
    playerRef.set({
      ...self.current,
      left: self.current.left / battleFieldWidth.current,
      top: self.current.top / battleFieldHeight.current,
      HP: (self.current.HP / MAX_HP) * 100,
    });
    playerRef.onDisconnect().remove();

    Render({ time: 0 });

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    let enemyRef;
    let enemyProjectileRef;
    let enemyProjectileDeletionRef;
    if (playerId === serverPlayerID) {
      enemyRef = projectDatabase.ref(
        `battle/${serverPlayerID}/${clientPlayerID}`
      );
      enemyProjectileRef = projectDatabase.ref(
        `battle/${serverPlayerID}/clientProjectile`
      );
      enemyProjectileDeletionRef = projectDatabase.ref(
        `battle/${serverPlayerID}/clientProjectileDeletion`
      );
    } else {
      enemyRef = projectDatabase.ref(
        `battle/${serverPlayerID}/${serverPlayerID}`
      );
      enemyProjectileRef = projectDatabase.ref(
        `battle/${serverPlayerID}/serverProjectile`
      );
      enemyProjectileDeletionRef = projectDatabase.ref(
        `battle/${serverPlayerID}/serverProjectileDeletion`
      );
    }
    enemyRef.off();
    enemyRef.on("value", (otherSnapshot) => {
      const p = otherSnapshot.val();
      if (p == null) {
        // Enemy disconnected or lost
        if (enemy.current != null) {
          controlsDead.current = true;
          EndSoundRef.current.play();

          const isWinner = self.current.HP > 0;
          const EnemyID =
            playerId === serverPlayerID ? clientPlayerID : serverPlayerID;
          setEndScreenData({
            Won: isWinner,
            enemyID: EnemyID,
            gold: goldBetAmount,
          });
          setTimeout(() => {
            projectDatabase.ref(`battle/${serverPlayerID}`).remove();
            projectDatabase.ref(`lobby/rooms/${serverPlayerID}`).remove();
            enemyRef.off();
            enemyProjectileRef.off();
            enemyProjectileDeletionRef.off();
            setGameState("EndScreen");
          }, 800);
        }
        // enemy.current = null;
      } else if (
        enemy.current &&
        enemy.current.projectileBuffMode != p.projectileBuffMode
      ) {
        weaponChangeSoundRef.current.currentTime = 0;
        weaponChangeSoundRef.current.play();
      }
      if (p) {
        enemy.current = {
          ...p,
          left: p.left * battleFieldWidth.current,
          top: p.top * battleFieldHeight.current,
        };
      }
    });

    enemyProjectileRef.off();
    enemyProjectileRef.on("value", (snapshot) => {
      const p = snapshot.val();
      if (p) {
        // Enemy FX
        shootSoundRef.current.play();
        projectiles.current.push({
          ...snapshot.val(),
          x: p.x * battleFieldWidth.current,
          y: p.y * battleFieldHeight.current,
          dx: p.dx * battleFieldWidth.current,
          dy: p.dy * battleFieldHeight.current,
        });
      }
    });

    enemyProjectileDeletionRef.off();
    enemyProjectileDeletionRef.on("value", (snapshot) => {
      const p = snapshot.val();
      if (p) {
        nextProjectileToDeleteQueue.current = p.key;
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
    if (controlsDead.current) return;
    if (!self.current.shooting && currentProjectileShotAmount.current < 5) {
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

        const newProjectile = {
          x: self.current.left + normalizedX * 3,
          y: self.current.top + normalizedY * 3,
          dx: normalizedX * 1.5,
          dy: normalizedY * 1.5,
          DMG: self.current.DMG,
          bulletState: 0, // 0-2 damage, >=3 for healing
          key: ProjectileKey.current++,
          projectileType: self.current.projectileBuffMode, // false: Healing, true: AttackBuff
        };

        projectileRef.set(
          {
            ...newProjectile,
            x: newProjectile.x / battleFieldWidth.current,
            y: newProjectile.y / battleFieldHeight.current,
            dx: newProjectile.dx
              ? newProjectile.dx / battleFieldWidth.current
              : 0,
            dy: newProjectile.dx
              ? newProjectile.dy / battleFieldHeight.current
              : 0,
          },
          () => {
            projectiles.current.push(newProjectile);
          }
        );
        // self.current.HP -= 5;

        currentProjectileShotAmount.current += 1;
        shootSoundRef.current.play();

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
      case 69:
        weaponChangeSoundRef.current.currentTime = 0;
        weaponChangeSoundRef.current.play();
        self.current.projectileBuffMode = !self.current.projectileBuffMode;
    }
  }

  const moveCharacter = useCallback(() => {
    if (controlsDead.current) return;
    if (!self.current.shooting) {
      let dx = 0;
      let dy = 0;

      if (up.current) {
        dy -= SPEED;
      }
      if (left.current) {
        dx -= SPEED;
      }
      if (down.current) {
        dy += SPEED;
      }
      if (right.current) {
        dx += SPEED;
      }
      handleKeyPress(dx, dy);
    }
    for (let i = 0; i < projectiles.current.length; i++) {
      // console.log(nextProjectileToDeleteQueue.current);
      const PC = projectiles.current[i];
      if (nextProjectileToDeleteQueue.current === PC.key) {
        if (PC.bulletState >= 3) {
          if (PC.projectileType) {
            //Buff
            buffSoundRef.current.currentTime = 0;
            buffSoundRef.current.play();
            animationKeyEnemy.current++;
            gotHitStyleEnemy.current = {
              margin: Math.random() * 2 + "vw 0 0 " + Math.random() * 3 + "vw",
              color: "rgb(0, 195, 255)",
            };
            hitAmountEnemy.current = enemy.current.initDMG;
          } else {
            // healing
            healSoundRef.current.currentTime = 0;
            healSoundRef.current.play();
            animationKeyEnemy.current++;
            gotHitStyleEnemy.current = {
              margin: Math.random() * 2 + "vw 0 0 " + Math.random() * 3 + "vw",
              color: "rgb(13, 255, 0)",
            };
            hitAmountEnemy.current = 20;
          }
        } else {
          hitNormalSoundRef.current.currentTime = 0;
          hitNormalSoundRef.current.play();
          animationKeyEnemy.current++;
          gotHitStyleEnemy.current = {
            margin: Math.random() * 2 + "vw 0 0 " + Math.random() * 3 + "vw",
            color: "red",
          };
          hitAmountEnemy.current = PC.DMG;
        }
        if (
          (playerId === serverPlayerID &&
            projectiles.current[i].key >= 10000) ||
          (playerId != serverPlayerID && projectiles.current[i].key < 10000)
        ) {
          currentProjectileShotAmount.current -= 1;
        }

        projectiles.current.splice(i, 1);
        return;
      }
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
          if (projectile.projectileType) {
            //Buff
            buffSoundRef.current.currentTime = 0;
            buffSoundRef.current.play();
            self.current.DMG += DMG / 3;
            gotHitStyle.current = {
              margin: Math.random() * 2 + "vw 0 0 " + Math.random() * 3 + "vw",
              color: "rgb(0, 195, 255)",
            };
            animationKey.current++;
            hitAmount.current = DMG / 3;
          } else {
            // healing
            healSoundRef.current.currentTime = 0;
            healSoundRef.current.play();
            self.current.HP += 20;
            if (self.current.HP > MAX_HP) {
              self.current.HP = MAX_HP;
            }
            gotHitStyle.current = {
              margin: Math.random() * 2 + "vw 0 0 " + Math.random() * 3 + "vw",
              color: "rgb(13, 255, 0)",
            };
            animationKey.current++;
            hitAmount.current = 20;
          }
        } else {
          hitNormalSoundRef.current.currentTime = 0;
          hitNormalSoundRef.current.play();

          self.current.HP -= projectile.DMG;
          hitAmount.current = projectile.DMG;

          gotHitStyle.current = {
            margin: Math.random() * 2 + "vw 0 0 " + Math.random() * 3 + "vw",
            color: "red",
          };
          animationKey.current++;

          if (self.current.HP <= 0) {
            EndSoundRef.current.play();
            self.current.HP = 0;
            Render({ time: Date.now() });
            playerRef.remove();
          }
        }
        projectileDeletionRef.set({ key: projectiles.current[i].key });
        if (
          (playerId === serverPlayerID &&
            projectiles.current[i].key >= 10000) ||
          (playerId != serverPlayerID && projectiles.current[i].key < 10000)
        ) {
          currentProjectileShotAmount.current -= 1;
        }
        projectiles.current.splice(i, 1);
      }

      if (
        projectile.y - 1 <= 0 ||
        projectile.y + 1 >= battleFieldHeight.current
      ) {
        projectile.dy *= -1;
        projectile.bulletState++;
      }
      if (
        projectile.x - 1 <= 0 ||
        projectile.x + 1 >= battleFieldWidth.current
      ) {
        projectile.dx *= -1;
        projectile.bulletState++;
      }
      if (projectile.bulletState >= 5) {
        if (
          (playerId === serverPlayerID &&
            projectiles.current[i].key >= 10000) ||
          (playerId === clientPlayerID && projectiles.current[i].key < 10000)
        ) {
          currentProjectileShotAmount.current -= 1;
        }
        projectiles.current.splice(i, 1);
      }
    }
    Render({ time: Date.now() /*- enemy.current.time*/ });
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(moveCharacter, 32); // Update position every 32ms
    return () => clearInterval(intervalRef.current);
  }, [moveCharacter]);

  return (
    <div
      ref={buttonDivRef}
      className={styles.ButtonOverlay}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => move(e)}
      onKeyUp={(e) => release(e)}
      onClick={()=>{
        shoot();
      }}
    >
      {/* <div className={styles.topBar}></div> */}
      {loading && <LoadingScreen />}
      {countDown && <GameCountDown />}
      {/* AUDIO */}
      <audio ref={shootSoundRef} src="/Sound/FX/shoot.mp3" />
      <audio ref={hitNormalSoundRef} src="/Sound/FX/hitNormal.mp3" />
      <audio ref={weaponChangeSoundRef} src="/Sound/FX/weaponChange.mp3" />
      <audio ref={buffSoundRef} src="/Sound/FX/buff.mp3" />
      <audio ref={healSoundRef} src="/Sound/FX/heal.ogg" />
      <audio ref={EndSoundRef} src="/Sound/FX/End.ogg" />

      {/* AUDIO END */}
      {/* <span className={styles.ping}>{reRender ? reRender.time : 0} ms</span> */}
      <div className={styles.battleContainer}>
        <div className={styles.battleFieldContainer}>
          <div
            className={styles.battleField}
            style={{
              width: battleFieldWidth.current + "vw",
              height: battleFieldHeight.current + "vw",
            }}
          >
            <img
              src={gameState === "Battle" ? map : rankedMap}
              className={styles.battleFieldImage}
              onLoad={() => {
                setTimeout(() => {
                  let loadCompleteRef = projectDatabase.ref(
                    `battle/${serverPlayerID}/loadComplete/${
                      serverPlayerID === playerId ? "server" : "client"
                    }`
                  );
                  loadCompleteRef.set(true);
                }, 1000);
              }}
            ></img>
            {/* <video width="100%" height="100%" autoPlay>
            <source src="/assets/video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video> */}
            {/* PROJECTILES START */}
            {projectiles.current.map((projectile, i) => (
              <div
                className={`${styles.projectile} ${
                  projectile.bulletState > 2
                    ? projectile.projectileType
                      ? styles.buff
                      : styles.healing
                    : ""
                }`}
                style={{
                  top: projectile.y + "vw",
                  left: projectile.x + "vw",
                  width: 2 + "vw",
                  height: 2 + "vw",
                }}
                key={projectile.key}
              ></div>
            ))}
            {/* PROJECTILES END */}
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
                <div
                  key={animationKey.current}
                  className={styles.damageNumber}
                  style={gotHitStyle.current}
                >
                  {hitAmount.current}
                </div>
              </div>
              <div className={styles.dmgUp}>
                {self.current.DMG}
                <img src="/publicAssets/BuffUpArrow.png"></img>
              </div>
              <div className={styles.HP_NAME_Bar}>
                <div className={styles.flex}>
                  <span
                    className={styles.projectileBuffMode}
                    style={{
                      backgroundColor: self.current.projectileBuffMode
                        ? "rgb(0, 195, 255)"
                        : "rgb(13, 255, 0)",
                    }}
                  >
                    {5 - currentProjectileShotAmount.current}
                  </span>
                  <p className={styles.characterName}>{self.current.name}</p>
                </div>
                <div className={styles.HPContainer}>
                  <div
                    className={styles.SelfHPBar}
                    style={{
                      width: (self.current.HP / MAX_HP) * 100 + "%",
                    }}
                  ></div>
                </div>
              </div>
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
                  src={enemy.current.slimePath + ".gif"}
                  className={styles.slimeImage}
                ></img>
                <div
                  key={animationKeyEnemy.current}
                  className={styles.damageNumber}
                  style={gotHitStyleEnemy.current}
                >
                  {hitAmountEnemy.current}
                </div>
                <div className={styles.dmgUp}>
                  {enemy.current.DMG}
                  <img src="/publicAssets/BuffUpArrow.png"></img>
                </div>
                <div className={styles.HP_NAME_Bar}>
                  <div className={styles.flex}>
                    <span
                      className={styles.projectileBuffMode}
                      style={{
                        backgroundColor: enemy.current.projectileBuffMode
                          ? "rgb(0, 195, 255)"
                          : "rgb(13, 255, 0)",
                      }}
                    ></span>
                    <p className={styles.characterName}>{enemy.current.name}</p>
                  </div>
                  <div className={styles.HPContainer}>
                    <div
                      className={styles.EnemyHPBar}
                      style={{
                        width: enemy.current.HP + "%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
