import { useAuthContext } from "../Database/Hooks/useAuthContext";
import { useCharacterAndThemeContext } from "../Database/Hooks/useCharacterAndThemeContext";
import { useLogout } from "../Database/Hooks/useLogout";
import styles from "./AccountBanner.module.css"
import banner from "/Account/Banners/Sky.jpg"


export default function AccountBanner({setShowBanner}) {
  const {logout} = useLogout();
  const {user} = useAuthContext();
  const { selectedSlimePath } = useCharacterAndThemeContext();
  
  return (
    <div className={styles.AccountBanner}>
      <h1 className={styles.Handle}>{user.displayName}</h1>
      <img src={selectedSlimePath} className={styles.character}></img>
      <p className={styles.Rank}>Rank: 100</p>
      <p className={styles.Status}>Hello my name is Rimuru. I'm not a bad Slime!</p>
      <button className={styles.SignOut} onClick={() => {if(setShowBanner) setShowBanner(false); logout()}}>Sign out</button>

      <img src={banner} className={styles.banner}></img>
    </div>
  )
}
