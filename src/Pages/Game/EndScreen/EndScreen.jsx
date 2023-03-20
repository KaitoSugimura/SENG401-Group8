import styles from "./EndScreen.module.css";
import slime from "/assets/GameArt/EarthSlime/EarthSlime1.gif";

export default function EndScreen({setGameState}) {
  return (
    <div className={styles.EndScreen}>
      <h1 className={styles.victoryMSG}>Your fucking trash</h1>
      <img src={slime} className={styles.characterImage}/>
      <p className={styles.rankGained}>Rank +10</p>
      <button onClick={() => setGameState("Lobby")} className={styles.returnToLobbyBtn}>Go back to Lobby in shame</button>
    </div>
  )
}
