import { useContext, useState } from "react";
import { AuthContext } from "../Database/context/AuthContext";
import { useLogout } from "../Database/Hooks/useLogout";
import styles from "./AccountBanner.module.css"
import banner from "/Account/Banners/Sky.jpg"


export default function AccountBanner({ setShowBanner }) {
  const { logout } = useLogout();
  const { user } = useContext(AuthContext);
  const [bSelectionOn, setBSelectionOn] = useState(false);

  return (
    <div className={styles.AccountBanner} >
      <h1 className={styles.Handle}>{user.displayName}</h1>
      <img src={user.data.slimePath} className={styles.character}></img>
      <p className={styles.Rank}>Rank: 100</p>
      <p className={styles.Status}>Hello my name is Rimuru. I'm not a bad Slime!</p>
      <button className={styles.SignOut} onClick={() => { if (setShowBanner) setShowBanner(false); logout() }}>Sign out</button>

      <img src={banner} className={styles.banner} onClick={() => { setBSelectionOn(true) }}></img>
      <button onClick={() => { setBSelectionOn(true) }} className={`${styles.banner} ${styles.bannerChangeButton}`}>hello</button>


      <div className={`${styles.bannerSelectionContainer} ${bSelectionOn ? styles.ShowBannerSelection : ""}`}>
        <button className={styles.bannerSelectionExit} onClick={() => { setBSelectionOn(false); }}>X</button>
      </div>
    </div>
  )
}
