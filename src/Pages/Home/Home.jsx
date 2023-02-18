import styles from "./Home.module.css";
import slimeImage from "../../../public/assets/GameArt/Slime.png";

const SnowflakeAmount = 60;
const rows = [];
for (var i = 0; i < SnowflakeAmount; i++) {
  const op = Math.random();
  const randSize = Math.random() * 20 + 5;
  const snowStyle = {
    opacity: op,
    left: `${Math.random() * 100}vw`,
    width: `${randSize}px`,
    height: `${randSize}px`,
    animationTimingFunction: "ease-in-out",
    animationDuration: Math.random() * 8 + 2 + "s",
    animationDelay:  Math.random() * 3 + "s",
    animationIterationCount: "infinite",
    animationDirection: "normal",
    animationFillMode: "forwards",
  };
  rows.push(<div className={styles.Snow} key={i} style={snowStyle}></div>);
}

export default function Home() {
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
      <img
        src={slimeImage}
        className={styles.characterIMG}
        alt="slime"
        draggable="false"
      />

      <div className={styles.SnowWrap}>{rows}</div>
    </div>
  );
}
