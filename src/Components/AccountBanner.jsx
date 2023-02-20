import { useAuthContext } from "../Database/Hooks/useAuthContext";
import { useLogout } from "../Database/Hooks/useLogout";
import styles from "./AccountBanner.module.css"


export default function AccountBanner() {
  const {logout} = useLogout();
  const {user} = useAuthContext();
  
  return (
    <div className={styles.AccountBanner}>
      <h1 className={styles.Handle}>{user.displayName}</h1>
      <img src="Account/TempPFP.png"></img>
      <p className={styles.Rank}>Rank: 100</p>
      <p className={styles.Status}>Hello my name is Rimuru. I'm not a bad Slime!</p>
      <button className={styles.SignOut} onClick={logout}>Sign out</button>
    </div>
  )
}
