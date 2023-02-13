import styles from "./AccountBanner.module.css"

export default function AccountBanner() {
  return (
    <div className={styles.AccountBanner}>
      <h1 className={styles.Handle}>Rimuru Tempest</h1>
      <img src="Account/TempPFP.png"></img>
      <p className={styles.Rank}>Rank: 100</p>
      <p className={styles.Status}>Hello my name is Rimuru. I'm not a bad Slime!</p>
      <button className={styles.SignOut}>Sign out</button>
    </div>
  )
}
