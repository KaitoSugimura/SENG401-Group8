import { useContext, useState } from "react";
import { AuthContext } from "../Database/context/AuthContext";
import { useLogout } from "../Database/Hooks/useLogout";
import styles from "./AccountBanner.module.css"
import Banner from "./Banner";


export default function AccountBanner({ setShowBanner }) {
  const { logout } = useLogout();
  const { user } = useContext(AuthContext);
  const [bSelectionOn, setBSelectionOn] = useState(false);
  const [banner, setBanner]=useState("/Account/Banners/cloudyMountains.jpg");

  const[banners,setBanners]=useState([
    "/Account/Banners/Sky.jpg",
    "/Account/Banners/cloudyMountains.jpg",
    "/Account/Banners/Sky.jpg",
    "/Account/Banners/cloudyMountains.jpg",
    "/Account/Banners/Sky.jpg",
    "/Account/Banners/Sky.jpg",
    "/Account/Banners/Sky.jpg",
    "/Account/Banners/cloudyMountains.jpg",
    "/Account/Banners/Sky.jpg",
  ]);

  return (
    <div className={styles.AccountBanner} >
      <div className={styles.bannerInfo}>
        <h1 className={styles.Handle}>{user.displayName}</h1>
        <div className={styles.editBannerButton} onClick={()=>{setBSelectionOn(true)}}>
          <img src="/Account/editBanner.png" alt="" />
        </div>      

      </div>
            
      <img src={user.data.slimePath+".svg"} className={styles.character}></img>
      <p className={styles.Rank}>Rank: {user.data.rank}</p>
      <p className={styles.Status}>Hello my name is Rimuru. I'm not a bad Slime!</p>
      <button className={styles.SignOut} onClick={() => { if (setShowBanner) setShowBanner(false); logout() }}>Sign out</button>

      <img src={banner} className={styles.banner} onClick={() => { setBSelectionOn(true) }}></img>
      
      


      <div className={`${styles.bannerSelectionContainer} ${bSelectionOn ? styles.ShowBannerSelection : ""}`}>
        <h1>Select a Banner</h1>
        <div className={styles.bannerOptions}>
          
          {banners.map((bannerx, index)=>(
            <Banner index = {index} banner={bannerx} setBanner={setBanner} banners={banners}></Banner>
          ))}
        </div>
        <button className={styles.bannerSelectionExit} onClick={() => { setBSelectionOn(false); }}>X</button>
      </div>
    </div>
  )
}
