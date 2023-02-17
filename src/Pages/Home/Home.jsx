import styles from "./Home.module.css";
import slimeImage from "../../../public/assets/GameArt/Slime.png";

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
    </div>
  );
}
