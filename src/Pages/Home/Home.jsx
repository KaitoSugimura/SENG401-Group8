import styles from "./Home.module.css";
import animation from "./HomeSlimeAnimations.module.css";
import chestOpen from "/assets/HomeIcons/chestOpen.png";
import chestClosed from "/assets/HomeIcons/chestClosed.png";
import achievement from "/assets/HomeIcons/achievement.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCharacterAndThemeContext } from "../../Database/Hooks/useCharacterAndThemeContext";
import { useAuthContext } from "../../Database/Hooks/useAuthContext";

const particleAmount = 60;
const rows = [];
for (var i = 0; i < particleAmount; i++) {
  const op = Math.random();
  const randSize = Math.random() * 20 + 5;
  const particlesStyle = {
    opacity: op,
    left: `${Math.random() * 100}vw`,
    width: `${randSize}px`,
    height: `${randSize}px`,
    animationTimingFunction: "ease-in-out",
    animationDuration: Math.random() * 8 + 2 + "s",
    animationDelay: Math.random() * 3 + "s",
    animationIterationCount: "infinite",
    animationDirection: "normal",
    animationFillMode: "forwards",
  };
  rows.push(
    <div className={styles.Particles} key={i} style={particlesStyle}></div>
  );
}

const animations = [
  animation.applyHorizontalShake,
  animation.applyVerticalShake,
  animation.applyVerticalSquish,
  animation.applyShrink,
];

export default function Home() {
  const [chestState, setChestState] = useState(false);
  const [petted, setPetted] = useState(false);
  const { selectedSlimePath } = useCharacterAndThemeContext();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  return (
    <div className={styles.Home}>
      <div className={styles.MainBanner}>
        <div className={styles.MBNameLevelContainer}>
          <p className={styles.MBName}>Rimuru Tempest</p>
          <p className={styles.MBLevel}>{user.data.level}</p>
        </div>
        <hr />
        <p className={styles.MBRank}>Rank {user.data.rank}</p>
      </div>
      <button
        onClick={(event) => {
          setPetted(true);
          setTimeout(() => {
            setPetted(false);
          }, 1001);
        }}
        disabled={petted}
      >
        <img
          src={selectedSlimePath}
          className={`${styles.characterIMG} ${petted
            ? animations[Math.floor(Math.random() * animations.length)]
            : ""
            }`}
          alt="slime"
          draggable="false"
        />
      </button>

      <div className={styles.tabs}>
        <div className={styles.tabsIcon}>
          <p>Daily Login</p>
          <img
            src={chestState ? chestOpen : chestClosed}
            className={styles.dailyChest}
            alt="Daily chest click to open"
            draggable="false"
            onClick={() => {
              setChestState(true);
            }}
          />
        </div>
        <div className={styles.tabsIcon}>
          <p>Achievements</p>
          <img
            src={achievement}
            className={styles.dailyChest}
            alt="Achievements"
            draggable="false"
          />
        </div>
      </div>

      {/* Rankings */}
      <div className={styles.RankingsContainer}>
        <p>Rankings:</p>
        <ol>
          <li>BAKASATANG</li>
          <li>FubukiKaito</li>
          <li>Rimuru Tempest</li>
        </ol>
      </div>

      {/* Play banner */}
      <button className={styles.PlayButton} onClick={() => {
        navigate("/game");
      }}>PLAY</button>

      <div className={styles.ParticlesWrap}>{rows}</div>
    </div>
  );
}
