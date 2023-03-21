import loadingSlime from "/assets/GameArt/LoadingSlime.gif";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  return (
    <div className={styles.container}>
      <div class={styles.loadingText}>
        <span >L</span>
        <span style={{animationDelay: `${0.1}s`}}>O</span>
        <span style={{animationDelay: `${0.2}s`}}>A</span>
        <span style={{animationDelay: `${0.3}s`}}>D</span>
        <span style={{animationDelay: `${0.4}s`}}>I</span>
        <span style={{animationDelay: `${0.5}s`}}>N</span>
        <span style={{animationDelay: `${0.6}s`}}>G</span>
        <span style={{animationDelay: `${0.7}s`}}>.</span>
        <span style={{animationDelay: `${0.8}s`}}>.</span>
        <span style={{animationDelay: `${0.9}s`}}>.</span>
      </div>
      <img src={loadingSlime} className={styles.loadingSlime} style={{animationDuration: `14s`, animationDelay: `${0.7}s`}} ></img>
    </div>
  );
}
