import styles from "./Home.module.css";
import slimeImage from "../../../public/assets/GameArt/Slime.png";
import chestOpen from "../../../public/assets/HomeIcons/chestOpen.png";
import chestClosed from "../../../public/assets/HomeIcons/chestClosed.png";
import { useState } from "react";

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

export default function Home() {
  const [chestState, setChestState] = useState(false);
  const [petted, setPetted] = useState(false);

  return (
    <div className={styles.Home}>
      <div className={styles.MainBanner}>
        <div className={styles.MBNameLevelContainer}>
          <p className={styles.MBName}>Rimuru Tempest</p>
          <p className={styles.MBLevel}>Lv.1</p>
        </div>
        <hr />
        <p className={styles.MBRank}>Rank 200</p>
      </div>
      <button
      onClick={(event) => {
        setPetted(true);
        setTimeout(()=>{setPetted(false)}, 1100);
      }}
      disabled={petted}>
      <img
        src={slimeImage}
        className={`${styles.characterIMG} ${petted ? styles.applyShake : ""}`}
        alt="slime"
        draggable="false"
      />
      </button>

      <img
        src={chestState ? chestOpen : chestClosed}
        className={styles.dailyChest}
        alt="Daily chest click to open"
        draggable="false"
        onClick={() => {
          setChestState(true);
        }}
      />

      <div className={styles.ParticlesWrap}>{rows}</div>
    </div>
  );
}
